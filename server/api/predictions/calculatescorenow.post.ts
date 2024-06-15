import { ResultType, type Match } from "~/types";

export default eventHandler(async () => {
  const predictions = await useDB().select().from(tables.predictions).all();
  const matches = await useDB()
    .select()
    .from(tables.matches)
    .where(sql`date < ${new Date().toISOString()} AND finished = 0`)
    .all();
  const scores = await useDB().select().from(tables.scores).all();

  matches.forEach(async (match) => {
    for (const prediction of predictions) {
      if (prediction.match === match.id) {
        const matchFromApi = await $fetch<Match>(`/api/matches/${match.id}`);
        const [results] = matchFromApi.matchResults.filter(
          (result) => result.resultTypeID === ResultType.Finished
        );

        const score = calculateScore(
          {
            team1Score: prediction.team1Score,
            team2Score: prediction.team2Score,
          },
          {
            team1Score: results.pointsTeam1,
            team2Score: results.pointsTeam2,
          }
        );

        if (scores.length === 0) {
          await useDB()
            .insert(tables.scores)
            .values({
              user: prediction.user,
              group: prediction.group,
              points: score,
            })
            .returning()
            .get();

          await useDB()
            .update(tables.predictions)
            .set({ finished: 1 })
            .where(eq(tables.predictions.id, prediction.id));
        } else {
          const foundScore = scores.find(
            (score) => score.user === prediction.user
          );
          if (foundScore && "id" in foundScore) {
            await useDB()
              .update(tables.scores)
              .set({
                points: foundScore.points + score,
                updatedAt: sql`CURRENT_TIMESTAMP`,
              })
              .where(
                and(
                  eq(tables.scores.group, prediction.group),
                  eq(tables.scores.user, prediction.user)
                )
              )
              .returning()
              .get();

            await useDB()
              .update(tables.predictions)
              .set({ finished: 1 })
              .where(eq(tables.predictions.id, prediction.id));
          }
        }
      }
    }
    await useDB()
      .update(tables.matches)
      .set({ finished: 1 })
      .where(eq(tables.matches.id, match.id));
  });
  return "done calculating scores";
});
