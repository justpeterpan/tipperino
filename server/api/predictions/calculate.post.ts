import { ResultType, type Match } from "~/types";

type MatchFromDB = {
  date: string;
  id: number;
  dateUTC: string;
  locationId: number | null;
  finished: number;
  updatedAt: string;
}[];

export default eventHandler(async () => {
  const BATCH_SIZE = 10;
  const drymode = false;
  const predictions = await useDB().select().from(tables.predictions).all();
  const matches = await useDB()
    .select()
    .from(tables.matches)
    .where(sql`date < ${new Date().toISOString()} AND finished = 0`)
    .all();
  const scores = await useDB().select().from(tables.scores).all();

  const processBatch = async (batch: MatchFromDB) => {
    await Promise.all(
      batch.map(async (match) => {
        const matchPredictions = predictions.filter(
          (prediction) => prediction.match === match.id
        );

        await Promise.all(
          matchPredictions.map(async (prediction) => {
            const matchFromApi = await $fetch<Match>(
              `/api/matches/${match.id}`
            );
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
              const foundScore = scores.find(
                (score) => score.user === prediction.user
              );
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

        if (drymode) {
          console.log(`Would have marked match ${match.id} as finished`);
        } else {
          await useDB()
            .update(tables.matches)
            .set({ finished: 1 })
            .where(eq(tables.matches.id, match.id));
        }
      })
    );
  };

  for (let i = 0; i < matches.length; i += BATCH_SIZE) {
    const batch = matches.slice(i, i + BATCH_SIZE);
    await processBatch(batch);
  }

  return "done calculating scores";
});
