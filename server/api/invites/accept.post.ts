import { InviteStatus } from "./status";

export default defineEventHandler(async (event) => {
  const { id, group } = await readBody(event);
  const session = await requireUserSession(event);
  await useDB()
    .update(tables.invites)
    .set({
      status: InviteStatus.Accepted,
      respondedAt: new Date().toISOString(),
    })
    .where(
      and(eq(tables.invites.user, session.user.id), eq(tables.invites.id, id))
    );
  await useDB().insert(tables.members).values({
    group,
    user: session.user.id,
    role: "member",
  });
});
