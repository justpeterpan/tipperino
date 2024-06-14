export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { answer, questionId, groupId } = await readBody(event);

  const timeOfFirstMatch = new Date(1718391600000);

  if (timeOfFirstMatch.getTime() < Date.now()) {
    return { message: "Match has already started", color: "red" };
  }

  await useDB()
    .update(tables.answers)
    .set({ answer })
    .where(
      and(
        eq(tables.answers.user, user.id),
        eq(tables.answers.group, Number(groupId)),
        eq(tables.answers.question, Number(questionId))
      )
    );

  return { message: "Answer updated successfully" };
});
