export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { group } = await getQuery(event);

  const predictions = await useDB()
    .select()
    .from(tables.predictions)
    .where(
      and(
        eq(tables.predictions.user, user.id),
        eq(tables.predictions.group, Number(group))
      )
    )
    .all();

  return predictions;
});
