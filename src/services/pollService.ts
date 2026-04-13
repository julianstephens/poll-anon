import type { CreatePollInput, Poll } from "@/types/poll";
import { pb } from "./pocketbase";

export const pollService = {
  async create(data: CreatePollInput): Promise<Poll> {
    return await pb.collection("poll_anon_polls").create(data);
  },

  async getById(id: string): Promise<Poll> {
    return await pb.collection("poll_anon_polls").getOne(id);
  },

  async update(id: string, data: Partial<Poll>): Promise<Poll> {
    return await pb.collection("poll_anon_polls").update(id, data);
  },

  subscribe(id: string, callback: (data: Poll) => void) {
    return pb
      .collection("poll_anon_polls")
      .subscribe(id, (e) => {
        callback(e.record as unknown as Poll);
      })
      .catch(() => () => {});
  },
};
