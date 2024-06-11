export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const groups = await useDB()
    .select({
      id: tables.members.group,
      name: tables.groups.name,
      role: tables.members.role,
    })
    .from(tables.members)
    .innerJoin(tables.users, eq(tables.members.user, tables.users.id))
    .innerJoin(tables.groups, eq(tables.members.group, tables.groups.id))
    .where(eq(tables.users.id, session.user.id));

  return groups;
});
