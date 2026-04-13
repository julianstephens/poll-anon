import { pollService } from "@/services/pollService";
import { type Poll, type PollPhase, PollPhaseEnum } from "@/types/poll";
import { getPollPhase } from "@/utils/pollHelpers";
import { useEffect, useState } from "react";

export const usePoll = (pollId: string) => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [phase, setPhase] = useState<PollPhase>(PollPhaseEnum.SUBMISSION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const data = await pollService.getById(pollId);
        setPoll(data);
        setPhase(getPollPhase(data));
      } catch {
        setError("Failed to load poll");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();

    // Subscribe to real-time updates
    const unsubscribe = pollService.subscribe(pollId, (data) => {
      setPoll(data);
      setPhase(getPollPhase(data));
    });

    return () => {
      unsubscribe?.then((unsub) => unsub());
    };
  }, [pollId]);

  return { poll, phase, loading, error };
};
