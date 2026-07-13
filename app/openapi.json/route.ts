import { openApiDocument } from "../../lib/api/openapi";

export async function GET() {
  return Response.json(openApiDocument, {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}
