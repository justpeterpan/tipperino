export type Match = {
  goals: any[];
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
  matchResults: any[];
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
  admin: string | null;
};
