export type Match = {
  goals: {
    goalID: number;
    scoreTeam1: number;
    scoreTeam2: number;
    matchMinute: number;
    goalGetterID: number;
    goalGetterName: string;
    isPenalty: boolean;
    isOwnGoal: boolean;
    isOvertime: boolean;
    comment: string;
  }[];
  group: {
    groupID: number;
    groupName: string;
    groupOrderID: number;
  };
  lastUpdateDateTime: string;
  leagueId: number;
  leagueName: string;
  leagueSeason: number;
  leagueShortcut: string;
  location: {
    locationCity: string;
    locationID: number;
    locationStadium: string;
  };
  matchDateTime: string;
  matchDateTimeUTC: string;
  matchID: number;
  matchIsFinished: boolean;
  matchResults: {
    resultID: number;
    resultName: string;
    pointsTeam1: number;
    pointsTeam2: number;
    resultOrderID: number;
    resultTypeID: number;
    resultDescription: string;
  }[];
  numberOfViewers: null | number;
  team1: {
    shortName: string;
    teamGroupName: null | string;
    teamIconUrl: string;
    teamId: number;
    teamName: string;
  };
  team2: {
    shortName: string;
    teamGroupName: null | string;
    teamIconUrl: string;
    teamId: number;
    teamName: string;
  };
  timeZoneID: string;
};

export type Group = {
  id: number;
  name: string | null;
  role?: "member" | "admin";
};

export type ResultInfo = {
  id: number;
  name: string;
  description: string;
  orderId: number;
  globalResultInfo: {
    id: number;
    name: string;
  };
};

export enum InviteStatus {
  Pending = 0,
  Accepted = 1,
  Declined = 2,
}

export enum ResultType {
  Halftime = 1,
  Finished = 2,
  ExtraTime = 4,
  Penalty = 5,
}

export enum ScoreType {
  Wrong = 0,
  Winner = 1,
  Difference = 2,
  Exact = 3,
}
