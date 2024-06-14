import { Match } from "~/types";

export default eventHandler(async (event) => {
  const matchId = getRouterParam(event, "id");
  console.info("fetching match");
  const match = await $fetch<Match>(
    `${useRuntimeConfig().public.api}/getmatchdata/${Number(matchId)}`
  );
  return match;
});
