export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  return await useDB()
    .select({ show: tables.users.show })
    .from(tables.users)
    .where(eq(tables.users.id, user.id));
});
