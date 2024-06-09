import { eq } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const invites = await useDB()
    .select({
      inviteId: tables.invites.id,
      groupId: tables.invites.group,
      name: tables.groups.name,
      status: tables.invites.status,
    })
    .from(tables.invites)
    .innerJoin(tables.groups, eq(tables.invites.group, tables.groups.id))
    .where(eq(tables.invites.user, session.user.id));
  return invites.filter((invite) => invite.status === 0);
});
