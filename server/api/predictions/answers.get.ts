export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { group } = getQuery(event);
  return useDB()
    .select()
    .from(tables.answers)
    .where(
      and(
        eq(tables.answers.user, user.id),
        eq(tables.answers.group, Number(group))
      )
    )
    .all();
});
