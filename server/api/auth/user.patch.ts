export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { name } = await readBody(event);
  await useDB()
    .update(tables.users)
    .set({ name })
    .where(eq(tables.users.id, user.id));

  await setUserSession(event, {
    user: {
      id: user.id,
      name,
    },
  });
  return sendRedirect(event, "/dashboard");
});
