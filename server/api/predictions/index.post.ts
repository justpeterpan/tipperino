export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const {
    match,
    group,
    team1Id,
    team1Name,
    team1Score,
    team2Id,
    team2Name,
    team2Score,
  } = await readBody(event);
  console.log(
    match,
    user.id,
    group,
    team1Id,
    team1Name,
    team1Score,
    team2Id,
    team2Name,
    team2Score
  );

  const res = await useDB()
    .insert(tables.predictions)
    .values({
      match,
      user: user.id,
      group,
      team1Id,
      team1Name,
      team1Score,
      team2Id,
      team2Name,
      team2Score,
    })
    .returning()
    .get();
  return res;
});
