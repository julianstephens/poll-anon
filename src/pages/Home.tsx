import { Box, Button, Flex, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [pollId, setPollId] = useState("");
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const id = pollId.trim();
    if (id) navigate(`/poll/${id}`);
  };

  return (
    <Stack align="center" justify="center" gap={{ base: 10, md: 16 }} py={{ base: 4, md: 8 }}>
      {/* Hero */}
      <Stack gap={4}>
        <Text
          fontSize={{ base: "3xl", md: "5xl" }}
          fontWeight="bold"
          letterSpacing="tight"
          color="white"
          lineHeight="1.15"
        >
          Anonymous polls,{" "}
          <Text as="span" color="purple.400">
            no account needed.
          </Text>
        </Text>
        <Text fontSize="md" color="whiteAlpha.500" maxW="md">
          Create a poll, share the link, let anyone submit options and vote — fully anonymous.
        </Text>
      </Stack>

      {/* Actions */}
      <Stack gap={6} maxW="sm">
        {/* Join */}
        <Stack gap={2}>
          <Text
            fontSize="xs"
            fontWeight="medium"
            color="whiteAlpha.500"
            letterSpacing="wider"
            textTransform="uppercase"
          >
            Join a poll
          </Text>
          <Box as="form" onSubmit={handleJoin}>
            <Flex gap={2}>
              <Input
                placeholder="Poll ID"
                value={pollId}
                onChange={(e) => setPollId(e.target.value)}
                bg="whiteAlpha.50"
                borderColor="whiteAlpha.100"
                color="white"
                _placeholder={{ color: "whiteAlpha.300" }}
                _focus={{ borderColor: "purple.500", bg: "whiteAlpha.100" }}
                size="md"
                fontFamily="mono"
                fontSize="sm"
              />
              <Button
                type="submit"
                variant="outline"
                borderColor="whiteAlpha.200"
                color="white"
                _hover={{ bg: "whiteAlpha.100" }}
                disabled={!pollId.trim()}
                px={5}
                flexShrink={0}
              >
                Go
              </Button>
            </Flex>
          </Box>
        </Stack>

        <Flex align="center" gap={3}>
          <Box flex={1} h="1px" bg="whiteAlpha.100" />
          <Text fontSize="xs" color="whiteAlpha.300">
            or
          </Text>
          <Box flex={1} h="1px" bg="whiteAlpha.100" />
        </Flex>

        {/* Create */}
        <Button
          onClick={() => navigate("/create")}
          bg="purple.600"
          color="white"
          _hover={{ bg: "purple.500" }}
          size="md"
        >
          Create a poll
        </Button>
      </Stack>
    </Stack>
  );
}
