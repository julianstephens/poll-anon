import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Stack align="center" gap={4} py={20}>
      <Heading size="4xl" color="fg.muted">
        404
      </Heading>
      <Heading size="lg">Page not found</Heading>
      <Text color="fg.muted">The page you're looking for doesn't exist.</Text>
      <Button colorPalette="blue" onClick={() => navigate("/")}>
        Go home
      </Button>
    </Stack>
  );
}
