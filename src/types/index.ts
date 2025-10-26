type sportOptions = 'football' | 'basketball' | 'tennis';
type statusOptions = 'live' | 'upcoming' | 'finished';

export type MatchesProps = {
  id: string,
  sport: sportOptions,
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number,
  status: statusOptions,
  matchTime: Date,
  league: string,
  venue: string,
  source: string,
  lastUpdated: Date
}

export type MatchesResponse = {
  matches: MatchesProps[],
  success: boolean
}
