export default eventHandler(async (event) => {
  const { name, admin } = await readBody(event);

  try {
    const group = await useDB()
      .insert(tables.groups)
      .values({ admin, name })
      .returning()
      .get();
    const member = await useDB()
      .insert(tables.members)
      .values({ group: group.id, user: admin, role: "admin" })
      .returning()
      .get();
    return { message: "Group created", group, member };
  } catch (error) {
    console.error("Error creating group: ", error);
  }
});
