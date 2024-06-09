export default defineEventHandler(async (event) => {
  // todo do not send invite if user already member
  const { group, user, by } = await readBody(event);
  try {
    const team = await useDB()
      .insert(tables.invites)
      .values({ group, user, by })
      .returning()
      .get();
    return team;
  } catch (error) {
    console.error(error);
  }
});
