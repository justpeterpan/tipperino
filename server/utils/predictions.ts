type MatchResult = {
  team1Score: number;
  team2Score: number;
};

export function calculateScore(prediction: MatchResult, actual: MatchResult) {
  if (
    prediction.team1Score !== actual.team1Score ||
    prediction.team2Score !== actual.team2Score
  ) {
    return 0;
  }

  if (
    prediction.team1Score === actual.team1Score &&
    prediction.team2Score === actual.team2Score
  ) {
    return 3;
  }
  return 0;
}
