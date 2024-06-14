import { Match } from "~/types";

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
  const matchFromApi = await $fetch<Match>(`/api/matches/${match}`);

  console.log("match time", new Date(matchFromApi.matchDateTimeUTC).getTime());
  console.log("now time", Date.now());

  if (new Date(matchFromApi.matchDateTimeUTC).getTime() < Date.now()) {
    return { message: "Match has already started", color: "red" };
  }

  await useDB()
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
  return { message: "Match prediction saved successfully" };
});
