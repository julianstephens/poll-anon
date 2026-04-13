export interface Poll {
  id: string;
  title: string;
  description?: string;
  creatorId: string;
  isLocked: boolean;
  submissionDeadline: string;
  votingDeadline: string;
  created: string;
  updated: string;
}

export interface CreatePollInput {
  title: string;
  description?: string;
  creatorId: string;
  isLocked: boolean;
  submissionDeadline: string;
  votingDeadline: string;
}

export const PollPhaseEnum = {
  SUBMISSION: "submission",
  VOTING: "voting",
  CLOSED: "closed",
} as const;

export type PollPhase = (typeof PollPhaseEnum)[keyof typeof PollPhaseEnum];
