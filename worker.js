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

        const createdAt =
          new Date().toISOString();

        const result =
          await env.DB.prepare(`
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
     * 修改已发送状态
     * ========================================
     */

    if (
      url.pathname.startsWith("/api/admin/guests/") &&
      request.method === "PATCH"
    ) {
      try {
        const id =
          url.pathname.split("/").pop();

        const body =
          await request.json();

        const sent =
          body.sent ? 1 : 0;

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

        /*
         * 删除旧版回复
         */
        await env.DB.prepare(`
          DELETE FROM replies
          WHERE guest_id = ?
        `)
          .bind(id)
          .run();

        /*
         * 删除新版多回复
         */
        await env.DB.prepare(`
          DELETE FROM reply_entries
          WHERE guest_id = ?
        `)
          .bind(id)
          .run();

        /*
         * 删除宾客
         */
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
     * 宾客提交回复
     *
     * 新版：
     * 不要求 guest 必须存在于 guests
     * 同一个请柬可以提交多条回复
     * ========================================
     */

    if (
      url.pathname === "/api/reply" &&
      request.method === "POST"
    ) {
      try {
        const body =
          await request.json();

        const guestName =
          String(body.guest || "").trim();

        const attendance =
          String(body.attendance || "").trim();

        const stay =
          String(body.stay || "").trim();

        const count =
          Math.max(
            1,
            parseInt(body.count, 10) || 1
          );

        const checkIn =
          String(body.checkIn || "").trim();

        const checkOut =
          String(body.checkOut || "").trim();

        const message =
          String(body.message || "").trim();

        if (!guestName) {
          return json(
            {
              success: false,
              error: "没有识别到宾客姓名",
            },
            400
          );
        }

        if (
          attendance !== "yes" &&
          attendance !== "no"
        ) {
          return json(
            {
              success: false,
              error: "请选择是否出席",
            },
            400
          );
        }

        /*
         * 如果是正式宾客，
         * 就绑定到 guests.id。
         *
         * 如果不是正式宾客，
         * guestId 就保持 null。
         *
         * 所以朋友转发以后，
         * 也不会被挡住。
         */
        const guestResult =
          await env.DB.prepare(`
            SELECT
              id,
              name
            FROM guests
            WHERE name = ?
            LIMIT 1
          `)
            .bind(guestName)
            .first();

        const guestId =
          guestResult
            ? guestResult.id
            : null;

        const savedGuestName =
          guestResult
            ? guestResult.name
            : guestName;

        const submittedAt =
          new Date().toISOString();

        /*
         * 每一次提交都是一条独立回复。
         *
         * 因此：
         * A 把链接转给 B
         * B 也可以提交
         *
         * 不会因为 A 已经回复，
         * 就把 B 拦住。
         */
        await env.DB.prepare(`
          INSERT INTO reply_entries (
            guest_id,
            guest_name,
            attendance,
            stay,
            count,
            check_in,
            check_out,
            message,
            submitted_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
          .bind(
            guestId,
            savedGuestName,
            attendance,
            stay,
            count,
            checkIn,
            checkOut,
            message,
            submittedAt
          )
          .run();

        return json({
          success: true,
          message: "回复已保存",
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
     * 管理员查看全部回复
     * ========================================
     */

    if (
      url.pathname === "/api/admin/replies" &&
      request.method === "GET"
    ) {
      try {

        /*
         * 旧版 replies
         *
         * 保留你之前测试成功的数据。
         */
        const oldResult =
          await env.DB.prepare(`
            SELECT
              r.id AS reply_id,
              g.id AS guest_id,
              g.name AS guest_name,
              g.sent,
              r.attendance,
              r.stay,
              r.count,
              r.check_in,
              r.check_out,
              r.message,
              r.submitted_at
            FROM replies r
            LEFT JOIN guests g
              ON g.id = r.guest_id
            ORDER BY r.id DESC
          `).all();

        /*
         * 新版 reply_entries
         */
        const newResult =
          await env.DB.prepare(`
            SELECT
              r.id AS reply_id,
              r.guest_id,
              r.guest_name,
              COALESCE(g.sent, 0) AS sent,
              r.attendance,
              r.stay,
              r.count,
              r.check_in,
              r.check_out,
              r.message,
              r.submitted_at
            FROM reply_entries r
            LEFT JOIN guests g
              ON g.id = r.guest_id
            ORDER BY r.id DESC
          `).all();

        const oldReplies =
          (oldResult.results || []).map(
            reply => ({
              ...reply,
              source: "legacy",
            })
          );

        const newReplies =
          (newResult.results || []).map(
            reply => ({
              ...reply,
              source: "entry",
            })
          );

        const replies = [
          ...oldReplies,
          ...newReplies,
        ].sort(
          (a, b) =>
            new Date(
              b.submitted_at || 0
            ).getTime() -
            new Date(
              a.submitted_at || 0
            ).getTime()
        );

        return json({
          success: true,
          replies,
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
