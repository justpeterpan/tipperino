export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { group, team1Score, team2Score } = await readBody(event);

  const res = await useDB()
    .update(tables.predictions)
    .set({ team1Score, team2Score })
    .where(
      and(
        eq(tables.predictions.user, user.id),
        eq(tables.predictions.group, Number(group))
      )
    );

  return res;
});
