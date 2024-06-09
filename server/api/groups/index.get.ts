import { eq } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  return await useDB()
    .select()
    .from(tables.groups)
    .where(eq(tables.groups.admin, session.user.id))
    .all();
});
