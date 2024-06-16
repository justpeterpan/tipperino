export default eventHandler(async (event) => {
  await requireUserSession(event);
  const { group } = getQuery(event);
  const answers = await useDB()
    .select({
      user: tables.users.name,
      answer: tables.answers.answer,
      group: tables.answers.group,
      question: tables.answers.question,
    })
    .from(tables.answers)
    .innerJoin(tables.users, eq(tables.answers.user, tables.users.id))
    .where(and(eq(tables.answers.group, Number(group))))
    .all();

  type UserAnswers = {
    [user: string]: {
      answer: string;
      group: number | null;
      question: number | null;
    }[];
  };

  const result: UserAnswers = {};

  answers.forEach((entry) => {
    const { user, answer, group, question } = entry;
    if (!result[user]) {
      result[user] = [];
    }

    result[user].push({ answer, group, question });
  });

  return result;
});
