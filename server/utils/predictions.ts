type MatchResult = {
  team1Score: number;
  team2Score: number;
};

const isWrong = (prediction: MatchResult, actual: MatchResult) => {
  return (
    prediction.team1Score !== actual.team1Score ||
    prediction.team2Score !== actual.team2Score
  );
};

const isExact = (prediction: MatchResult, actual: MatchResult) => {
  return (
    prediction.team1Score === actual.team1Score &&
    prediction.team2Score === actual.team2Score
  );
};

const isGoalDifferenceCorrect = (
  prediction: MatchResult,
  actual: MatchResult
) => {
  const predictionDifference = Math.abs(
    prediction.team1Score - prediction.team2Score
  );
  const actualDifference = Math.abs(actual.team1Score - actual.team2Score);

  return predictionDifference === actualDifference;
};

const isWinnerCorrect = (prediction: MatchResult, actual: MatchResult) => {
  if (
    (isWrong(prediction, actual) && isExact(prediction, actual)) ||
    isExact(prediction, actual)
  ) {
    return false;
  }

  const predictionWinner =
    prediction.team1Score > prediction.team2Score ? "team1" : "team2";
  const actualWinner =
    actual.team1Score > actual.team2Score ? "team1" : "team2";

  return predictionWinner === actualWinner;
};

export function calculateScore(prediction: MatchResult, actual: MatchResult) {
  if (isExact(prediction, actual)) {
    return 3;
  }
  if (isGoalDifferenceCorrect(prediction, actual)) {
    return 2;
  }
  if (isWinnerCorrect(prediction, actual)) {
    return 1;
  }
  return 0;
}
