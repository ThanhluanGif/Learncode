import { getDb } from "../../../db";
import { learners } from "../../../db/schema";

export async function GET() {
  try {
    const db = getDb();
    await db.select({ id: learners.id }).from(learners).limit(1);
    return Response.json({ status: "ok", database: "ok", version: "v1" });
  } catch (error) {
    console.error("Health check failed", error);
    return Response.json(
      { status: "degraded", database: "error", version: "v1" },
      { status: 503 },
    );
  }
}
