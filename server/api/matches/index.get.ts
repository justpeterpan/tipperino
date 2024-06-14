import { Match } from "~/types";

export default eventHandler(async () => {
  console.info("fetching matches");
  const matches = await $fetch<Match[]>(
    `${useRuntimeConfig().public.api}/getmatchdata/em2024/2024`
  );
  return matches;
});
