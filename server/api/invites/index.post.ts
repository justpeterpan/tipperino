export default defineEventHandler(async (event) => {
  const { group, user, by } = await readBody(event);
  try {
    const alreadyInvited = await useDB()
      .select()
      .from(tables.invites)
      .where(
        and(eq(tables.invites.group, group), eq(tables.invites.user, user))
      );
    const alreadyMember = await useDB()
      .select()
      .from(tables.members)
      .where(
        and(eq(tables.members.group, group), eq(tables.members.user, user))
      );
    if (alreadyMember.length > 0) {
      return { message: "User already member" };
    }
    if (alreadyInvited.length > 0) {
      return { message: "User already invited" };
    } else {
      await useDB()
        .insert(tables.invites)
        .values({ group, user, by })
        .returning()
        .get();
      return { message: "Invite sent" };
    }
  } catch (error) {
    console.error(error);
  }
});
