import { useUserId } from "@/hooks/useUserId";
import { pollService } from "@/services/pollService";
import { Box, Button, Field, Input, Stack, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const inputStyles = {
  bg: "whiteAlpha.50",
  borderColor: "whiteAlpha.100",
  color: "white",
  _placeholder: { color: "whiteAlpha.300" },
  _focus: { borderColor: "purple.500", bg: "whiteAlpha.100" },
};

const labelStyles = {
  fontSize: "xs" as const,
  fontWeight: "medium" as const,
  color: "whiteAlpha.500",
  letterSpacing: "wider",
  textTransform: "uppercase" as const,
  mb: 1,
};

export default function CreatePoll() {
  const navigate = useNavigate();
  const userId = useUserId();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [votingDeadline, setVotingDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const poll = await pollService.create({
        title: title.trim(),
        description: description.trim() || undefined,
        creatorId: userId,
        isLocked: false,
        submissionDeadline: new Date(submissionDeadline).toISOString(),
        votingDeadline: new Date(votingDeadline).toISOString(),
      });
      navigate(`/poll/${poll.id}`);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 429) {
        setError("Daily limit reached: you can only create 5 polls per day.");
      } else {
        setError("Failed to create poll. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    title.trim() &&
    submissionDeadline &&
    votingDeadline &&
    new Date(submissionDeadline) < new Date(votingDeadline);

  const deadlineInvalid = !!(
    submissionDeadline &&
    votingDeadline &&
    new Date(votingDeadline) <= new Date(submissionDeadline)
  );

  return (
    <Stack gap={8} w="full">
      <Stack gap={1}>
        <Text fontSize="2xl" fontWeight="bold" color="white" letterSpacing="tight">
          New poll
        </Text>
        <Text fontSize="sm" color="whiteAlpha.400">
          Share the poll ID once created so others can join.
        </Text>
      </Stack>

      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="whiteAlpha.50"
        borderWidth="1px"
        borderColor="whiteAlpha.100"
        borderRadius="xl"
        p={{ base: 4, sm: 6 }}
      >
        <Stack gap={5}>
          <Field.Root required>
            <Field.Label {...labelStyles}>
              Title <Field.RequiredIndicator />
            </Field.Label>
            <Input
              placeholder="What are we deciding?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              {...inputStyles}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label {...labelStyles}>Description</Field.Label>
            <Textarea
              placeholder="Optional context or rules"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              {...inputStyles}
            />
          </Field.Root>

          <Stack direction={{ base: "column", sm: "row" }} gap={4}>
            <Field.Root required flex={1}>
              <Field.Label {...labelStyles}>
                Submission deadline <Field.RequiredIndicator />
              </Field.Label>
              <Input
                type="datetime-local"
                value={submissionDeadline}
                onChange={(e) => setSubmissionDeadline(e.target.value)}
                {...inputStyles}
              />
            </Field.Root>

            <Field.Root required invalid={deadlineInvalid} flex={1}>
              <Field.Label {...labelStyles}>
                Voting deadline <Field.RequiredIndicator />
              </Field.Label>
              <Input
                type="datetime-local"
                value={votingDeadline}
                onChange={(e) => setVotingDeadline(e.target.value)}
                {...inputStyles}
              />
              {deadlineInvalid && (
                <Field.ErrorText fontSize="xs">Must be after submission deadline.</Field.ErrorText>
              )}
            </Field.Root>
          </Stack>

          {error && (
            <Text color="red.400" fontSize="sm">
              {error}
            </Text>
          )}

          <Button
            type="submit"
            bg="purple.600"
            color="white"
            _hover={{ bg: "purple.500" }}
            loading={loading}
            disabled={!isValid}
            mt={2}
          >
            Create poll
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
