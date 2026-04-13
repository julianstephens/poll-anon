export interface PollOption {
  id: string;
  pollId: string;
  title: string;
  description?: string;
  submittedBy: string;
  created: string;
  updated: string;
}

export interface CreateOptionInput {
  pollId: string;
  title: string;
  description?: string;
  submittedBy: string;
}
