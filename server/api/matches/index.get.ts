import { Match } from "~/types";

export default cachedEventHandler(
  async () => {
    console.info("fetching matches");
    const matches = await $fetch<Match[]>(
      `${useRuntimeConfig().public.api}/getmatchdata/em2024/2024`
    );
    return matches;
  },
  {
    base: "matchesCache",
    getKey: () => "matchesCache",
    shouldBypassCache: () => false,
    maxAge: 60 * 60 * 24 * 7,
    staleMaxAge: 60 * 60 * 24 * 30,
  }
);
