export interface Vote {
  id: string;
  pollId: string;
  optionId: string;
  voterId: string;
  created: string;
}

export interface VoteResult {
  optionId: string;
  count: number;
}
