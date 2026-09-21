function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}


/* =========================================================
   婚礼页面：根据 ?guest=宾客姓名 动态修改分享信息
========================================================= */

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
        element.setAttribute(
          "content",
          meta.description
        );
      },
    })

    .on('meta[property="og:title"]', {
      element(element) {
        element.setAttribute(
          "content",
          meta.title
        );
      },
    })

    .on('meta[property="og:description"]', {
      element(element) {
        element.setAttribute(
          "content",
          meta.description
        );
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
        element.setAttribute(
          "content",
          url.href
        );
      },
    })

    .on('meta[name="twitter:title"]', {
      element(element) {
        element.setAttribute(
          "content",
          meta.title
        );
      },
    })

    .on('meta[name="twitter:description"]', {
      element(element) {
        element.setAttribute(
          "content",
          meta.description
        );
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


/* =========================================================
   管理员鉴权
========================================================= */

function checkAdmin(request, env) {
  const auth = request.headers.get("Authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    return false;
  }

  const password = auth.slice(7);

  if (!env.ADMIN_PASSWORD) {
    return false;
  }

  return password === env.ADMIN_PASSWORD;
}


/* =========================================================
   生成婚礼邀请文字
========================================================= */

function buildWechatMessage(guest, sender) {
  const name = guest.name;

  let sentence = "";

  if (sender === "groom") {
    sentence =
      `${name}，诚邀您参加我们的婚礼。`;
  }

  if (sender === "bride") {
    sentence =
      `${name}，诚邀您参加我们的婚礼。`;
  }

  if (
    sender === "groomFather" ||
    sender === "groomMother"
  ) {
    sentence =
      `${name}，诚邀您参加我儿子邓天澍和儿媳妇邹涛的婚礼。`;
  }

  if (
    sender === "brideFather" ||
    sender === "brideMother"
  ) {
    sentence =
      `${name}，诚邀您参加我女儿邹涛和女婿邓天澍的婚礼。`;
  }

  if (!sentence) {
    sentence =
      `${name}，诚邀您参加我们的婚礼。`;
  }

  return [
    "邓天澍 & 邹涛｜婚礼邀请",
    "",
    sentence,
    "",
    "2026年10月25日，吉安见。",
    "",
    "👉 点击打开专属请柬：",
    guest.link,
  ].join("\n");
}


/* =========================================================
   Worker
========================================================= */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);


    /* =====================================================
       婚礼首页
    ===================================================== */

    if (
      url.pathname === "/" &&
      request.method === "GET"
    ) {
      return handleWeddingPage(
        request,
        env
      );
    }


    /* =====================================================
       所有后台 API：统一鉴权
    ===================================================== */

    if (url.pathname.startsWith("/api/admin/")) {
      if (!checkAdmin(request, env)) {
        return json(
          {
            success: false,
            error: "未授权或密码错误",
          },
          401
        );
      }
    }


    /* =====================================================
       获取宾客
    ===================================================== */

    if (
      url.pathname === "/api/admin/guests" &&
      request.method === "GET"
    ) {
      try {
        const result =
          await env.DB.prepare(`
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


    /* =====================================================
       添加宾客
    ===================================================== */

    if (
      url.pathname === "/api/admin/guests" &&
      request.method === "POST"
    ) {
      try {
        const body =
          await request.json();

        const name =
          String(body.name || "").trim();

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


    /* =====================================================
       修改发送状态
    ===================================================== */

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
          .bind(
            sent,
            id
          )
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


    /* =====================================================
       删除宾客
    ===================================================== */

    if (
      url.pathname.startsWith("/api/admin/guests/") &&
      request.method === "DELETE"
    ) {
      try {
        const id =
          url.pathname.split("/").pop();

        await env.DB.prepare(`
          DELETE FROM replies
          WHERE guest_id = ?
        `)
          .bind(id)
          .run();

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


    /* =====================================================
       公开留言 / RSVP
       
       重点：
       不要求宾客必须存在于 guests 表。
       
       如果找到：
         guest_id = 对应宾客 ID
       
       如果没找到：
         guest_id = NULL
       
       这样任何人都可以留言。
    ===================================================== */

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
          String(
            body.attendance || ""
          ).trim();

        const stay =
          String(
            body.stay || ""
          ).trim();

        const count =
          Math.max(
            1,
            parseInt(body.count, 10) || 1
          );

        const checkIn =
          String(
            body.checkIn || ""
          ).trim();

        const checkOut =
          String(
            body.checkOut || ""
          ).trim();

        const message =
          String(
            body.message || ""
          ).trim();


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


        /* -----------------------------------------------
           尝试寻找已有宾客
        ------------------------------------------------ */

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


        const submittedAt =
          new Date().toISOString();


        /* -----------------------------------------------
           已存在的宾客
           
           guest_id 有值
           ON CONFLICT 可以更新原来的回复
        ------------------------------------------------ */

        if (guestResult) {

          await env.DB.prepare(`
            INSERT INTO replies (
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

            ON CONFLICT(guest_id)
            DO UPDATE SET
              guest_name = excluded.guest_name,
              attendance = excluded.attendance,
              stay = excluded.stay,
              count = excluded.count,
              check_in = excluded.check_in,
              check_out = excluded.check_out,
              message = excluded.message,
              submitted_at = excluded.submitted_at
          `)
            .bind(
              guestResult.id,
              guestResult.name,
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
        }


        /* -----------------------------------------------
           不存在于宾客名单的人
           
           guest_id = NULL
           
           这种留言不会被强制添加到宾客名单。
        ------------------------------------------------ */

        await env.DB.prepare(`
          INSERT INTO replies (
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
            null,
            guestName,
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


    /* =====================================================
       后台获取所有回复
       
       这里不能再：
         FROM guests LEFT JOIN replies
       
       因为那样会漏掉“未提前添加的访客”。
       
       改成：
         FROM replies LEFT JOIN guests
       
       所有公开留言都能显示。
    ===================================================== */

    if (
      url.pathname === "/api/admin/replies" &&
      request.method === "GET"
    ) {
      try {

        const result =
          await env.DB.prepare(`
            SELECT
              r.id AS reply_id,
              r.guest_id AS guest_id,

              COALESCE(
                g.name,
                r.guest_name
              ) AS guest_name,

              COALESCE(
                g.sent,
                0
              ) AS sent,

              r.attendance,
              r.stay,
              r.count,
              r.check_in,
              r.check_out,
              r.message,
              r.submitted_at,

              CASE
                WHEN g.id IS NULL
                THEN 1
                ELSE 0
              END AS is_public

            FROM replies r

            LEFT JOIN guests g
              ON g.id = r.guest_id

            ORDER BY
              r.id DESC
          `).all();


        return json({
          success: true,
          replies:
            result.results || [],
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


    /* =====================================================
       其他请求交给静态资源
    ===================================================== */

    return env.ASSETS.fetch(request);
  },
};
