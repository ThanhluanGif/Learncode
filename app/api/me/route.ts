import { handledApiError } from "../../../lib/api/errors";
import { requireCurrentLearner } from "../../../lib/auth/current-learner";

export async function GET(request: Request) {
  try {
    const learner = await requireCurrentLearner(request.headers);
    return Response.json({ learner });
  } catch (error) {
    return handledApiError(error);
  }
}
