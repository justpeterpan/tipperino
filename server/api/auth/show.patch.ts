export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { show } = await readBody(event);
  await useDB()
    .update(tables.users)
    .set({ show })
    .where(eq(tables.users.id, user.id));
});
