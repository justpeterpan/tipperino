import { ResultType, type Match } from "~/types";

type MatchPredictions = {
  id: number;
  group: number;
  user: string;
  finished: number;
  updatedAt: string;
  match: number;
  team1Id: number;
  team1Name: string;
  team1Score: number;
  team2Id: number;
  team2Name: string;
  team2Score: number;
}[];

export default eventHandler(async (event) => {
  const { matchId } = getQuery(event);
  console.log(matchId);
  if (!matchId) return "No match id provided";
  const BATCH_SIZE = 1;
  const drymode = false;
  const matchFromApi = await $fetch<Match>(`/api/matches/${matchId}`);
  const matchPredictions = await useDB()
    .select()
    .from(tables.predictions)
    .where(eq(tables.predictions.match, Number(matchId)))
    .all();
  const scores = await useDB().select().from(tables.scores).all();

  const processBatch = async (batch: MatchPredictions) => {
    await Promise.all(
      batch.map(async (prediction) => {
        const [results] = matchFromApi.matchResults.find(
          (result) => result.resultTypeID === ResultType.ExtraTime
        )
          ? matchFromApi.matchResults.filter(
              (result) => result.resultTypeID === ResultType.ExtraTime
            )
          : matchFromApi.matchResults.filter(
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
          if (drymode) {
            console.log(
              `Would have inserted score ${score} for user ${prediction.user} in group ${prediction.group}`
            );
          } else {
            await useDB()
              .insert(tables.scores)
              .values({
                user: prediction.user,
                group: prediction.group,
                points: score,
              })
              .returning()
              .get();
            console.log(
              `Inserted score ${score} for user ${prediction.user} in group ${prediction.group}`
            );
          }

          if (drymode) {
            console.log(
              `Would have marked prediction ${prediction.id} as finished`
            );
          } else {
            await useDB()
              .update(tables.predictions)
              .set({ finished: 1 })
              .where(eq(tables.predictions.id, prediction.id));
          }
        } else {
          const foundScore = scores.find((score) => {
            return (
              score.user === prediction.user && score.group === prediction.group
            );
          });
          if (foundScore && "id" in foundScore) {
            if (drymode) {
              console.log(
                `Would have updated score ${foundScore.points} to ${
                  foundScore.points + score
                } for user ${prediction.user} in group ${prediction.group}`
              );
            } else {
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
              console.log(
                `Updated score ${foundScore.points} to ${
                  foundScore.points + score
                } for user ${prediction.user} in group ${prediction.group}`
              );
            }

            if (drymode) {
              console.log(
                `Would have marked prediction ${prediction.id} as finished`
              );
            } else {
              await useDB()
                .update(tables.predictions)
                .set({ finished: 1 })
                .where(eq(tables.predictions.id, prediction.id));
            }
          }
        }
      })
    );
  };

  for (let i = 0; i < matchPredictions.length; i += BATCH_SIZE) {
    const batch = matchPredictions.slice(i, i + BATCH_SIZE);
    await processBatch(batch);
  }

  if (drymode) {
    console.log(`Would have marked match ${matchId} as finished`);
  } else {
    await useDB()
      .update(tables.matches)
      .set({ finished: 1 })
      .where(eq(tables.matches.id, Number(matchId)));
  }

  return "done calculating scores";
});
