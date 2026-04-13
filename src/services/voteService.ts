import type { Vote, VoteResult } from "@/types/vote";
import { pb } from "./pocketbase";

export const voteService = {
  async create(pollId: string, optionId: string, voterId: string): Promise<Vote> {
    return await pb.collection("poll_anon_votes").create({ pollId, optionId, voterId });
  },

  async getVoteResults(pollId: string): Promise<VoteResult[]> {
    const votes = await pb.collection("poll_anon_votes").getFullList({
      filter: pb.filter("pollId = {:pollId}", { pollId }),
    });

    const results = votes.reduce(
      (acc, vote) => {
        acc[vote.optionId] = (acc[vote.optionId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(results).map(([optionId, count]) => ({ optionId, count }));
  },

  async getUserVote(pollId: string, voterId: string): Promise<Vote | null> {
    try {
      const result = await pb
        .collection("poll_anon_votes")
        .getFirstListItem(
          pb.filter("pollId = {:pollId} && voterId = {:voterId}", { pollId, voterId }),
        );
      return result as unknown as Vote;
    } catch {
      return null;
    }
  },

  subscribe(pollId: string, callback: () => void) {
    return pb
      .collection("poll_anon_votes")
      .subscribe("*", (e) => {
        if (e.record.pollId === pollId) {
          callback();
        }
      })
      .catch(() => () => {});
  },
};
