export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =========================
    // API：宾客列表
    // =========================
    if (url.pathname === "/api/guests" && request.method === "GET") {
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

    // =========================
    // API：新增宾客
    // =========================
    if (url.pathname === "/api/guests" && request.method === "POST") {
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

        const origin = url.origin;
        const link =
          `${origin}/?guest=${encodeURIComponent(name)}`;

        const createdAt = new Date().toISOString();

        const result = await env.DB
          .prepare(`
            INSERT INTO guests
              (name, link, sent, created_at)
            VALUES (?, ?, 0, ?)
          `)
          .bind(name, link, createdAt)
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
        if (error.message.includes("UNIQUE")) {
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

    // =========================
    // API：修改发送状态
    // =========================
    if (
      url.pathname.startsWith("/api/guests/") &&
      request.method === "PATCH"
    ) {
      try {
        const id = url.pathname.split("/").pop();
        const body = await request.json();

        const sent = body.sent ? 1 : 0;

        await env.DB
          .prepare(`
            UPDATE guests
            SET sent = ?
            WHERE id = ?
          `)
          .bind(sent, id)
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

    // =========================
    // API：删除宾客
    // =========================
    if (
      url.pathname.startsWith("/api/guests/") &&
      request.method === "DELETE"
    ) {
      try {
        const id = url.pathname.split("/").pop();

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

    // =========================
    // 其他请求 → 正常婚礼网站
    // =========================
    return env.ASSETS.fetch(request);
  }
};
