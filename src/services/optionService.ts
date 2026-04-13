import type { CreateOptionInput, PollOption } from "@/types/option";
import { pb } from "./pocketbase";

export const optionService = {
  async create(data: CreateOptionInput): Promise<PollOption> {
    return await pb.collection("poll_anon_poll_options").create(data);
  },

  async getByPollId(pollId: string): Promise<PollOption[]> {
    return await pb.collection("poll_anon_poll_options").getFullList({
      filter: pb.filter("pollId = {:pollId}", { pollId }),
      sort: "-created",
    });
  },

  async update(id: string, data: Partial<PollOption>): Promise<PollOption> {
    return await pb.collection("poll_anon_poll_options").update(id, data);
  },

  async delete(id: string): Promise<boolean> {
    return await pb.collection("poll_anon_poll_options").delete(id);
  },

  subscribe(pollId: string, callback: (data: PollOption[]) => void) {
    return pb
      .collection("poll_anon_poll_options")
      .subscribe("*", (e) => {
        if (e.record.pollId === pollId) {
          // Refetch all options for simplicity
          this.getByPollId(pollId).then(callback);
        }
      })
      .catch(() => () => {});
  },
};
