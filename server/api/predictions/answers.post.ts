export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { answer, questionId, groupId } = await readBody(event);

  const timeOfFirstMatch = new Date(1718391600000);

  if (timeOfFirstMatch.getTime() < Date.now()) {
    return { message: "Match has already started", color: "red" };
  }

  if (!answer) {
    return { message: "Answer is required, duh" };
  }

  await useDB()
    .insert(tables.answers)
    .values({
      answer,
      group: Number(groupId),
      question: questionId,
      user: user.id,
    });

  return { message: "Answer saved successfully" };
});
