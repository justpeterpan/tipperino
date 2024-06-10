export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  console.log(id);
  const group = await useDB()
    .select()
    .from(tables.groups)
    .where(eq(tables.groups.id, Number(id)));
  return group[0];
});
