export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { group } = getQuery(event);
  const users = await useDB()
    .select({ user: tables.users.id, name: tables.users.name })
    .from(tables.members)
    .innerJoin(tables.users, eq(tables.members.user, tables.users.id))
    .where(and(eq(tables.members.group, Number(group))))
    .all();

  return users.some((u) => u.user === user.id)
    ? users.map((user) => user.name)
    : [];
});
