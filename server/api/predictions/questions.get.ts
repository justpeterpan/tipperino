export default eventHandler(async () => {
  return useDB().select().from(tables.questions).all();
});
