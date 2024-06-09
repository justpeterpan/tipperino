export default oauth.auth0EventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user }) {
    const registeredUser = await useDB()
      .select()
      .from(tables.users)
      .where(eq(tables.users.id, user.email))
      .all();
    if (registeredUser.length === 0) {
      await useDB()
        .insert(tables.users)
        .values({
          id: user.email,
        })
        .returning()
        .get();
    }
    await setUserSession(event, {
      user: {
        auth0: user.email,
      },
    });

    return sendRedirect(event, "/home");
  },
});
