type MatchResult = {
  team1Score: number;
  team2Score: number;
};

// const isWrong = (prediction: MatchResult, actual: MatchResult) => {
//   return (
//     prediction.team1Score !== actual.team1Score ||
//     prediction.team2Score !== actual.team2Score
//   );
// };

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
  const predictionDifference = prediction.team1Score - prediction.team2Score;
  const actualDifference = actual.team1Score - actual.team2Score;

  return predictionDifference === actualDifference;
};

const isWinnerCorrect = (prediction: MatchResult, actual: MatchResult) => {
  if (isExact(prediction, actual)) {
    return false;
  }

  let predictionWinner;
  if (prediction.team1Score > prediction.team2Score) {
    predictionWinner = "team1";
  } else if (prediction.team1Score < prediction.team2Score) {
    predictionWinner = "team2";
  } else {
    predictionWinner = "draw";
  }
  let actualWinner;
  if (actual.team1Score > actual.team2Score) {
    actualWinner = "team1";
  } else if (actual.team1Score < actual.team2Score) {
    actualWinner = "team2";
  } else {
    actualWinner = "draw";
  }

  return predictionWinner === actualWinner;
};

export function calcS(prediction: MatchResult, actual: MatchResult): number {
  if (
    prediction.team1Score === undefined ||
    prediction.team2Score === undefined
  ) {
    return 0;
  }
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
