import { eq } from "drizzle-orm";
import { getDb } from "../../db";
import { learners } from "../../db/schema";
import { resolveLearner, type LearnerIdentityStore, type LearnerRecord } from "./identity";

function toLearnerRecord(row: typeof learners.$inferSelect): LearnerRecord {
  return {
    id: row.id,
    displayName: row.displayName,
    division: row.division as LearnerRecord["division"],
    schoolLevel: row.schoolLevel as LearnerRecord["schoolLevel"],
    xp: row.xp,
    createdAt: row.createdAt,
  };
}

export async function requireCurrentLearner(headers: Headers): Promise<LearnerRecord> {
  const db = getDb();
  const store: LearnerIdentityStore = {
    async findByEmail(email) {
      const [row] = await db.select().from(learners).where(eq(learners.email, email)).limit(1);
      return row ? toLearnerRecord(row) : null;
    },
    async create({ email, displayName }) {
      try {
        const [row] = await db.insert(learners).values({ email, displayName }).returning();
        return toLearnerRecord(row);
      } catch (error) {
        const [row] = await db.select().from(learners).where(eq(learners.email, email)).limit(1);
        if (row) return toLearnerRecord(row);
        throw error;
      }
    },
  };

  return resolveLearner(headers, store);
}
