import { Match } from "~/types";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { match, group, team1Score, team2Score } = await readBody(event);

  const matchFromApi = await $fetch<Match>(`/api/matches/${match}`);

  console.log("match time", new Date(matchFromApi.matchDateTimeUTC).getTime());
  console.log("now time", Date.now());

  if (new Date(matchFromApi.matchDateTimeUTC).getTime() < Date.now()) {
    return { message: "Match has already started", color: "red" };
  }

  await useDB()
    .update(tables.predictions)
    .set({ team1Score, team2Score })
    .where(
      and(
        eq(tables.predictions.user, user.id),
        eq(tables.predictions.group, Number(group)),
        eq(tables.predictions.match, Number(match))
      )
    );

  return { message: "Match prediction updated successfully" };
});
