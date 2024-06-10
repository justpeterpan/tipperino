export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const { user } = await requireUserSession(event);

  const group = await useDB()
    .select()
    .from(tables.groups)
    .where(eq(tables.groups.id, Number(id)));

  const members = await useDB()
    .select()
    .from(tables.members)
    .where(eq(tables.members.group, Number(id)));

  const isMember = members.some((member) => member.user === user.id);
  return isMember ? group[0] : null;
});
