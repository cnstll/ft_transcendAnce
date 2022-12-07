export interface MatchHistory {
  id: string;
  imageCurrentUser: string | null;
  imageOpponent: string | null;
  score: string;
  matchWon: boolean;
}
