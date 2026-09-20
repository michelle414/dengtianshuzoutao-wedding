export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =====================================================
    // 管理后台 API：统一进行密码验证
    // =====================================================

    if (url.pathname.startsWith("/api/admin/")) {
      const auth = request.headers.get("Authorization");

      // 没有登录凭证
      if (!auth || !auth.startsWith("Bearer ")) {
        return Response.json(
          {
            success: false,
            error: "未授权"
          },
          { status: 401 }
        );
      }

      // 取得浏览器提交的密码
      const password = auth.slice(7);

      // 检查 Cloudflare Secret 是否存在
      if (!env.ADMIN_PASSWORD) {
        return Response.json(
          {
            success: false,
            error: "ADMIN_PASSWORD 没有读取到"
          },
          { status: 500 }
        );
      }

      // 检查密码
      if (password !== env.ADMIN_PASSWORD) {
        return Response.json(
          {
            success: false,
            error: "密码错误"
          },
          { status: 401 }
        );
      }
    }


    // =====================================================
    // 获取宾客列表
    // GET /api/admin/guests
    // =====================================================

    if (
      url.pathname === "/api/admin/guests" &&
      request.method === "GET"
    ) {
      try {
        const result = await env.DB
          .prepare(`
            SELECT id, name, link, sent, created_at
            FROM guests
            ORDER BY id DESC
          `)
          .all();

        return Response.json({
          success: true,
          guests: result.results || []
        });

      } catch (error) {
        return Response.json(
          {
            success: false,
            error: error.message
          },
          { status: 500 }
        );
      }
    }


    // =====================================================
    // 添加宾客
    // POST /api/admin/guests
    // =====================================================

    if (
      url.pathname === "/api/admin/guests" &&
      request.method === "POST"
    ) {
      try {
        const body = await request.json();

        const name = String(body.name || "").trim();

        if (!name) {
          return Response.json(
            {
              success: false,
              error: "请输入宾客姓名"
            },
            { status: 400 }
          );
        }

        // 生成专属请柬链接
        const link =
          `${url.origin}/?guest=${encodeURIComponent(name)}`;

        const createdAt = new Date().toISOString();

        const result = await env.DB
          .prepare(`
            INSERT INTO guests
              (name, link, sent, created_at)
            VALUES (?, ?, 0, ?)
          `)
          .bind(
            name,
            link,
            createdAt
          )
          .run();

        return Response.json({
          success: true,
          id: result.meta.last_row_id,
          name,
          link,
          sent: 0,
          created_at: createdAt
        });

      } catch (error) {

        // 姓名重复
        if (
          error.message &&
          error.message.includes("UNIQUE")
        ) {
          return Response.json(
            {
              success: false,
              error: "这个宾客已经添加过了"
            },
            { status: 409 }
          );
        }

        return Response.json(
          {
            success: false,
            error: error.message
          },
          { status: 500 }
        );
      }
    }


    // =====================================================
    // 修改发送状态
    // PATCH /api/admin/guests/:id
    // =====================================================

    if (
      url.pathname.startsWith("/api/admin/guests/") &&
      request.method === "PATCH"
    ) {
      try {
        const id =
          url.pathname.split("/").pop();

        const body = await request.json();

        const sent =
          body.sent ? 1 : 0;

        await env.DB
          .prepare(`
            UPDATE guests
            SET sent = ?
            WHERE id = ?
          `)
          .bind(
            sent,
            id
          )
          .run();

        return Response.json({
          success: true
        });

      } catch (error) {
        return Response.json(
          {
            success: false,
            error: error.message
          },
          { status: 500 }
        );
      }
    }


    // =====================================================
    // 删除宾客
    // DELETE /api/admin/guests/:id
    // =====================================================

    if (
      url.pathname.startsWith("/api/admin/guests/") &&
      request.method === "DELETE"
    ) {
      try {
        const id =
          url.pathname.split("/").pop();

        await env.DB
          .prepare(`
            DELETE FROM guests
            WHERE id = ?
          `)
          .bind(id)
          .run();

        return Response.json({
          success: true
        });

      } catch (error) {
        return Response.json(
          {
            success: false,
            error: error.message
          },
          { status: 500 }
        );
      }
    }


    // =====================================================
    // 普通网站
    // =====================================================

    return env.ASSETS.fetch(request);
  }
};
