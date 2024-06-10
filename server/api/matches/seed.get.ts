import { matches } from "~/server/database/schema";
import type { Match } from "~/types";

export default eventHandler(async () => {
  const config = useRuntimeConfig();
  const matchesFromApi = await $fetch<Match[]>(
    `${config.public.api}/getmatchdata/em2024/2024`
  );

  const matchesForDB = matchesFromApi.map((match) => {
    return {
      id: match.matchID,
      date: match.matchDateTime,
      dateUTC: match.matchDateTimeUTC,
      locationId: match.location.locationID,
    };
  });

  const batchSize = 10;

  for (let i = 0; i < matchesForDB.length; i += batchSize) {
    const batch = matchesForDB.slice(i, i + batchSize);
    await useDB().insert(matches).values(batch);
  }
  return matchesFromApi;
});
