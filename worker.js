function json(data, status = 200) {
  return Response.json(data, { status });
}

function buildGuestMeta(guest) {
  const safeGuest = guest || "宾客";

  return {
    title: `邓天澍 & 邹涛｜婚礼邀请`,
    description: `${safeGuest}，诚邀您参加我们的婚礼。2026年10月25日，吉安见。`,
    image: `/photos/photo-01.jpg`,
  };
}

async function handleWeddingPage(request, env) {
  const url = new URL(request.url);

  const assetResponse = await env.ASSETS.fetch(request);

  if (!assetResponse.ok) {
    return assetResponse;
  }

  const guest = (url.searchParams.get("guest") || "").trim();

  // 没有 guest 参数时，直接返回正常首页
  if (!guest) {
    return assetResponse;
  }

  const meta = buildGuestMeta(guest);

  return new HTMLRewriter()
    .on("title", {
      element(element) {
        element.setInnerContent(meta.title);
      },
    })

    .on('meta[name="description"]', {
      element(element) {
        element.setAttribute("content", meta.description);
      },
    })

    .on('meta[property="og:title"]', {
      element(element) {
        element.setAttribute("content", meta.title);
      },
    })

    .on('meta[property="og:description"]', {
      element(element) {
        element.setAttribute("content", meta.description);
      },
    })

    .on('meta[property="og:image"]', {
      element(element) {
        element.setAttribute(
          "content",
          new URL(meta.image, url.origin).href
        );
      },
    })

    .on('meta[property="og:url"]', {
      element(element) {
        element.setAttribute("content", url.href);
      },
    })

    .on('meta[name="twitter:title"]', {
      element(element) {
        element.setAttribute("content", meta.title);
      },
    })

    .on('meta[name="twitter:description"]', {
      element(element) {
        element.setAttribute("content", meta.description);
      },
    })

    .on('meta[name="twitter:image"]', {
      element(element) {
        element.setAttribute(
          "content",
          new URL(meta.image, url.origin).href
        );
      },
    })

    .transform(assetResponse);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /*
     * ========================================
     * 婚礼首页
     * ========================================
     */

    if (
      url.pathname === "/" &&
      request.method === "GET"
    ) {
      return handleWeddingPage(request, env);
    }

    /*
     * ========================================
     * 管理员 API 鉴权
     * ========================================
     */

    if (url.pathname.startsWith("/api/admin/")) {
      const auth = request.headers.get("Authorization");

      if (!auth || !auth.startsWith("Bearer ")) {
        return json(
          {
            success: false,
            error: "未授权",
          },
          401
        );
      }

      const password = auth.slice(7);

      if (!env.ADMIN_PASSWORD) {
        return json(
          {
            success: false,
            error: "ADMIN_PASSWORD 没有读取到",
          },
          500
        );
      }

      if (password !== env.ADMIN_PASSWORD) {
        return json(
          {
            success: false,
            error: "密码错误",
          },
          401
        );
      }
    }

    /*
     * ========================================
     * 获取宾客列表
     * ========================================
     */

    if (
      url.pathname === "/api/admin/guests" &&
      request.method === "GET"
    ) {
      try {
        const result = await env.DB.prepare(`
          SELECT
            id,
            name,
            link,
            sent,
            created_at
          FROM guests
          ORDER BY id DESC
        `).all();

        return json({
          success: true,
          guests: result.results || [],
        });
      } catch (error) {
        return json(
          {
            success: false,
            error: error.message,
          },
          500
        );
      }
    }

    /*
     * ========================================
     * 添加宾客
     * ========================================
     */

    if (
      url.pathname === "/api/admin/guests" &&
      request.method === "POST"
    ) {
      try {
        const body = await request.json();

        const name = String(body.name || "").trim();

        if (!name) {
          return json(
            {
              success: false,
              error: "请输入宾客姓名",
            },
            400
          );
        }

        const link =
          `${url.origin}/?guest=${encodeURIComponent(name)}`;

        const createdAt = new Date().toISOString();

        const result = await env.DB.prepare(`
          INSERT INTO guests (
            name,
            link,
            sent,
            created_at
          )
          VALUES (?, ?, 0, ?)
        `)
          .bind(
            name,
            link,
            createdAt
          )
          .run();

        return json({
          success: true,
          id: result.meta.last_row_id,
          name,
          link,
          sent: 0,
          created_at: createdAt,
        });
      } catch (error) {
        if (
          error.message &&
          error.message.includes("UNIQUE")
        ) {
          return json(
            {
              success: false,
              error: "这个宾客已经添加过了",
            },
            409
          );
        }

        return json(
          {
            success: false,
            error: error.message,
          },
          500
        );
      }
    }

    /*
     * ========================================
     * 修改“已发送”状态
     * ========================================
     */

    if (
      url.pathname.startsWith("/api/admin/guests/") &&
      request.method === "PATCH"
    ) {
      try {
        const id =
          url.pathname.split("/").pop();

        const body = await request.json();

        const sent = body.sent ? 1 : 0;

        await env.DB.prepare(`
          UPDATE guests
          SET sent = ?
          WHERE id = ?
        `)
          .bind(sent, id)
          .run();

        return json({
          success: true,
        });
      } catch (error) {
        return json(
          {
            success: false,
            error: error.message,
          },
          500
        );
      }
    }

    /*
     * ========================================
     * 删除宾客
     * ========================================
     */

    if (
      url.pathname.startsWith("/api/admin/guests/") &&
      request.method === "DELETE"
    ) {
      try {
        const id =
          url.pathname.split("/").pop();

        await env.DB.prepare(`
          DELETE FROM guests
          WHERE id = ?
        `)
          .bind(id)
          .run();

        return json({
          success: true,
        });
      } catch (error) {
        return json(
          {
            success: false,
            error: error.message,
          },
          500
        );
      }
    }

    /*
     * ========================================
     * 其他静态文件
     * ========================================
     */

    return env.ASSETS.fetch(request);
  },
};
