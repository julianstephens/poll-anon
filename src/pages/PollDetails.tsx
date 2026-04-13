import { usePoll } from "@/hooks/usePoll";
import { useUserId } from "@/hooks/useUserId";
import { optionService } from "@/services/optionService";
import { voteService } from "@/services/voteService";
import type { PollOption } from "@/types/option";
import { PollPhaseEnum } from "@/types/poll";
import type { VoteResult } from "@/types/vote";
import { getTimeRemaining } from "@/utils/pollHelpers";
import {
  Badge,
  Box,
  Button,
  Field,
  Flex,
  Input,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuCheck, LuClock, LuCopy } from "react-icons/lu";
import { useParams } from "react-router-dom";

const inputStyles = {
  bg: "whiteAlpha.50",
  borderColor: "whiteAlpha.100",
  color: "white",
  _placeholder: { color: "whiteAlpha.300" },
  _focus: { borderColor: "purple.500", bg: "whiteAlpha.100" },
};

const phaseConfig = {
  submission: { label: "Accepting submissions", color: "blue" as const },
  voting: { label: "Voting open", color: "green" as const },
  closed: { label: "Closed", color: "gray" as const },
};

export default function PollDetails() {
  const { pollId } = useParams<{ pollId: string }>();
  const userId = useUserId();
  const { poll, phase, loading, error } = usePoll(pollId!);

  const [options, setOptions] = useState<PollOption[]>([]);
  const [voteResults, setVoteResults] = useState<VoteResult[]>([]);
  const [userVoteOptionId, setUserVoteOptionId] = useState<string | null>(null);
  const [optionsLoading, setOptionsLoading] = useState(true);

  const [newOptionTitle, setNewOptionTitle] = useState("");
  const [newOptionDescription, setNewOptionDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const totalVotes = voteResults.reduce((sum, r) => sum + r.count, 0);

  useEffect(() => {
    if (!pollId) return;

    const loadOptions = async () => {
      setOptionsLoading(true);
      try {
        const data = await optionService.getByPollId(pollId);
        setOptions(data);
      } catch {
        // options stay as empty array; optionsLoading cleared by finally
      } finally {
        setOptionsLoading(false);
      }
    };

    loadOptions();

    const unsubOptions = optionService.subscribe(pollId, setOptions);
    return () => {
      unsubOptions?.then((unsub) => unsub());
    };
  }, [pollId]);

  useEffect(() => {
    if (!pollId || !userId) return;

    const loadVotes = async () => {
      const [results, userVote] = await Promise.all([
        voteService.getVoteResults(pollId),
        voteService.getUserVote(pollId, userId),
      ]);
      setVoteResults(results);
      setUserVoteOptionId(userVote?.optionId ?? null);
    };

    loadVotes();

    const unsubVotes = voteService.subscribe(pollId, () => {
      voteService.getVoteResults(pollId).then(setVoteResults);
    });

    return () => {
      unsubVotes?.then((unsub) => unsub());
    };
  }, [pollId, userId]);

  const handleSubmitOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollId || !newOptionTitle.trim()) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      await optionService.create({
        pollId,
        title: newOptionTitle.trim(),
        description: newOptionDescription.trim() || undefined,
        submittedBy: userId,
      });
      setNewOptionTitle("");
      setNewOptionDescription("");
    } catch (err: unknown) {
      const pbErr = err as {
        status?: number;
        response?: { data?: Record<string, unknown>; message?: string };
      };
      const status = pbErr?.status;
      const data = pbErr?.response?.data;
      // PocketBase returns 400 with empty data ({}) for rule violations;
      // field validation errors have keys in data.
      const isRuleViolation = status === 400 && data != null && Object.keys(data).length === 0;
      if (status === 403 || isRuleViolation) {
        setSubmitError("Submissions are closed for this poll.");
      } else {
        setSubmitError("Failed to submit option. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (optionId: string) => {
    if (!pollId || !userId || voting) return;
    setVoteError(null);
    setVoting(true);
    try {
      await voteService.create(pollId, optionId, userId);
      setUserVoteOptionId(optionId);
      const results = await voteService.getVoteResults(pollId);
      setVoteResults(results);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 400) {
        setVoteError("Voting is closed or you have already voted.");
      } else {
        setVoteError("Failed to submit vote. Please try again.");
      }
    } finally {
      setVoting(false);
    }
  };

  const handleCopyId = () => {
    if (!pollId) return;
    navigator.clipboard.writeText(pollId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <Flex justify="center" py={20}>
        <Spinner size="lg" color="purple.400" />
      </Flex>
    );
  }

  if (error || !poll) {
    return (
      <Stack align="center" py={20}>
        <Text color="red.400">{error ?? "Poll not found."}</Text>
      </Stack>
    );
  }

  const { label: phaseLabel, color: phaseColor } = phaseConfig[phase];

  const activeDeadline =
    phase === PollPhaseEnum.SUBMISSION
      ? poll.submissionDeadline
      : phase === PollPhaseEnum.VOTING
        ? poll.votingDeadline
        : null;

  return (
    <Stack gap={8}>
      {/* Header */}
      <Stack gap={3}>
        <Flex align="center" gap={3} flexWrap="wrap">
          <Badge
            colorPalette={phaseColor}
            variant="subtle"
            fontSize="xs"
            letterSpacing="wider"
            textTransform="uppercase"
            px={2}
            py={1}
          >
            {phaseLabel}
          </Badge>
          {activeDeadline && (
            <Flex align="center" gap={1}>
              <LuClock size={12} color="var(--chakra-colors-whiteAlpha-400)" />
              <Text fontSize="xs" color="whiteAlpha.400">
                {phase === PollPhaseEnum.SUBMISSION ? "Submissions" : "Voting"} close in{" "}
                {getTimeRemaining(activeDeadline)}
              </Text>
            </Flex>
          )}
        </Flex>

        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          color="white"
          letterSpacing="tight"
          lineHeight="1.2"
        >
          {poll.title}
        </Text>

        {poll.description && (
          <Text fontSize="sm" color="whiteAlpha.500">
            {poll.description}
          </Text>
        )}

        {/* Poll ID */}
        <Flex
          align="center"
          gap={2}
          bg="whiteAlpha.50"
          borderWidth="1px"
          borderColor="whiteAlpha.100"
          borderRadius="md"
          px={3}
          py={2}
          maxW="full"
          w="fit-content"
          cursor="pointer"
          onClick={handleCopyId}
          _hover={{ bg: "whiteAlpha.100" }}
          transition="background 0.15s"
          role="button"
          title="Copy poll ID"
        >
          <Text fontSize="xs" color="whiteAlpha.400" fontFamily="mono" truncate>
            {pollId}
          </Text>
          <Box color={copied ? "green.400" : "whiteAlpha.400"} transition="color 0.15s">
            {copied ? <LuCheck size={12} /> : <LuCopy size={12} />}
          </Box>
        </Flex>
      </Stack>

      {/* Divider */}
      <Box h="1px" bg="whiteAlpha.100" />

      {/* Submit Option */}
      {phase === PollPhaseEnum.SUBMISSION && (
        <Stack gap={4}>
          <Text
            fontSize="xs"
            fontWeight="medium"
            color="whiteAlpha.500"
            letterSpacing="wider"
            textTransform="uppercase"
          >
            Submit an option
          </Text>
          <Box
            as="form"
            onSubmit={handleSubmitOption}
            bg="whiteAlpha.50"
            borderWidth="1px"
            borderColor="whiteAlpha.100"
            borderRadius="xl"
            p={{ base: 3, sm: 5 }}
          >
            <Stack gap={3}>
              <Field.Root required>
                <Input
                  placeholder="Option title"
                  value={newOptionTitle}
                  onChange={(e) => setNewOptionTitle(e.target.value)}
                  {...inputStyles}
                />
              </Field.Root>
              <Textarea
                placeholder="Description (optional)"
                value={newOptionDescription}
                onChange={(e) => setNewOptionDescription(e.target.value)}
                rows={2}
                {...inputStyles}
              />
              <Button
                type="submit"
                bg="purple.600"
                color="white"
                _hover={{ bg: "purple.500" }}
                alignSelf="flex-end"
                size="sm"
                loading={submitting}
                disabled={!newOptionTitle.trim()}
              >
                Submit
              </Button>
              {submitError && (
                <Text fontSize="xs" color="red.400">
                  {submitError}
                </Text>
              )}
            </Stack>
          </Box>
        </Stack>
      )}

      {/* Options */}
      <Stack gap={4}>
        <Flex justify="space-between" align="center">
          <Text
            fontSize="xs"
            fontWeight="medium"
            color="whiteAlpha.500"
            letterSpacing="wider"
            textTransform="uppercase"
          >
            Options
          </Text>
          {options.length > 0 && (
            <Text fontSize="xs" color="whiteAlpha.300">
              {options.length} submitted · {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
            </Text>
          )}
        </Flex>

        {optionsLoading ? (
          <Flex justify="center" py={8}>
            <Spinner size="md" color="whiteAlpha.400" />
          </Flex>
        ) : options.length === 0 ? (
          <Box
            py={10}
            textAlign="center"
            borderWidth="1px"
            borderColor="whiteAlpha.100"
            borderRadius="xl"
            borderStyle="dashed"
          >
            <Text color="whiteAlpha.300" fontSize="sm">
              No options yet.
              {phase === PollPhaseEnum.SUBMISSION ? " Be the first to submit one." : ""}
            </Text>
          </Box>
        ) : (
          <Stack gap={3}>
            {options.map((option) => {
              const result = voteResults.find((r) => r.optionId === option.id);
              const count = result?.count ?? 0;
              const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
              const isVoted = userVoteOptionId === option.id;
              const showResults = phase === PollPhaseEnum.VOTING || phase === PollPhaseEnum.CLOSED;

              return (
                <Box
                  key={option.id}
                  p={{ base: 3, sm: 4 }}
                  borderWidth="1px"
                  borderColor={isVoted ? "purple.800" : "whiteAlpha.100"}
                  borderRadius="xl"
                  bg={isVoted ? "purple.950" : "whiteAlpha.50"}
                  transition="all 0.2s"
                  _hover={
                    phase === PollPhaseEnum.VOTING && !userVoteOptionId
                      ? { borderColor: "whiteAlpha.300", bg: "whiteAlpha.100" }
                      : {}
                  }
                >
                  <Stack gap={2}>
                    <Flex align="flex-start" justify="space-between" gap={4}>
                      <Stack gap={1} flex={1} minW={0}>
                        <Text fontWeight="medium" fontSize="sm" color="white">
                          {option.title}
                        </Text>
                        {option.description && (
                          <Text fontSize="xs" color="whiteAlpha.400">
                            {option.description}
                          </Text>
                        )}
                      </Stack>

                      <Flex align="center" gap={2} flexShrink={0}>
                        {showResults && (
                          <Text fontSize="sm" color="whiteAlpha.500" fontFamily="mono">
                            {percent}%
                          </Text>
                        )}
                        {isVoted && (
                          <Flex align="center" gap={1}>
                            <LuCheck size={12} color="var(--chakra-colors-purple-400)" />
                            <Text fontSize="xs" color="purple.400">
                              Voted
                            </Text>
                          </Flex>
                        )}
                      </Flex>
                    </Flex>

                    {phase === PollPhaseEnum.VOTING && !userVoteOptionId && (
                      <Button
                        size="sm"
                        bg="purple.600"
                        color="white"
                        borderColor="purple.600"
                        _hover={{ bg: "purple.500", borderColor: "purple.500" }}
                        loading={voting}
                        onClick={() => handleVote(option.id)}
                        w={{ base: "full", sm: "auto" }}
                        alignSelf={{ base: "stretch", sm: "flex-start" }}
                      >
                        Vote
                      </Button>
                    )}

                    {voteError && phase === PollPhaseEnum.VOTING && (
                      <Text fontSize="xs" color="red.400">
                        {voteError}
                      </Text>
                    )}

                    {showResults && (
                      <Box h="2px" bg="whiteAlpha.100" borderRadius="full" overflow="hidden">
                        <Box
                          h="full"
                          bg={isVoted ? "purple.500" : "whiteAlpha.300"}
                          w={`${percent}%`}
                          transition="width 0.4s ease"
                          borderRadius="full"
                        />
                      </Box>
                    )}
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
