import { Box, Container, Flex } from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <Box minH="100vh" minW="100vw" bg="gray.950">
      {/* Nav */}
      <Box
        as="nav"
        position="sticky"
        top={0}
        zIndex={10}
        borderBottomWidth="1px"
        borderColor="whiteAlpha.100"
        backdropFilter="blur(12px)"
        bg="blackAlpha.600"
      >
        <Container maxW="3xl" py={4}>
          <Flex align="center" justify="space-between">
            <Link
              to="/"
              style={{
                fontFamily: "monospace",
                fontWeight: 600,
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "white",
                textDecoration: "none",
              }}
            >
              pollanon
            </Link>

            <Link
              to="/create"
              style={{
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
              }}
            >
              + new poll
            </Link>
          </Flex>
        </Container>
      </Box>

      <Container
        maxW="3xl"
        py={{ base: 6, md: 10 }}
        px={{ base: 4, md: 6 }}
        mx={{ base: 0, md: "auto" }}
        flex={1}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
