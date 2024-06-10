export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { match, group, team1Score, team2Score } = await readBody(event);
  console.log(match, user.id, group, team1Score, team2Score);

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
