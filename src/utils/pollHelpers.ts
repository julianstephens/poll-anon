import { type Poll, type PollPhase, PollPhaseEnum } from "@/types/poll";

// PocketBase returns dates as "YYYY-MM-DD HH:MM:SS.sssZ" (space separator).
// Replace the space with "T" to ensure correct ISO 8601 parsing in all environments.
const parsePbDate = (s: string) => new Date(s.replace(" ", "T"));

export const getPollPhase = (poll: Poll): PollPhase => {
  const now = new Date();
  const submissionDeadline = parsePbDate(poll.submissionDeadline);
  const votingDeadline = parsePbDate(poll.votingDeadline);

  if (now < submissionDeadline) {
    return PollPhaseEnum.SUBMISSION;
  } else if (now < votingDeadline) {
    return PollPhaseEnum.VOTING;
  } else {
    return PollPhaseEnum.CLOSED;
  }
};

export const getTimeRemaining = (deadline: string): string => {
  const now = new Date();
  const end = parsePbDate(deadline);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};
