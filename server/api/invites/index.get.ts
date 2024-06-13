import { eq } from "drizzle-orm";
import { InviteStatus } from "~/types";
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
    .where(
      and(
        eq(tables.invites.user, session.user.id),
        eq(tables.invites.status, InviteStatus.Pending)
      )
    );
  const pendingInvites = await useDB()
    .select()
    .from(tables.invites)
    .where(
      and(
        eq(tables.invites.by, session.user.id),
        eq(tables.invites.status, InviteStatus.Pending)
      )
    );

  return { invites, pendingInvites };
});
