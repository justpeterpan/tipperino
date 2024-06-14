export default eventHandler(async (event) => {
  const team = await $fetch(
    "https://api.football-data.org/v4/competitions/2018/teams",
    {
      headers: {
        "X-Auth-Token": "",
      },
    }
  );
  return team;
});
// 759 _ deutschland
// 2018 _ em 2024
