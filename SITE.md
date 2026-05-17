# Poll Anon

Poll Anon is a simple, anonymous polling application built with Node.js and Express. It allows users to create polls, vote on them, and view results without revealing their identities.

## Features

- Create polls with multiple options
- Vote on polls anonymously
- View poll results after defined voting period
- Responsive design for mobile and desktop

## Architecture

**Tech Stack:**

- Node.js
- Express
- PocketBase (for data storage)
- React
- Chakra UI

Poll Anon takes advantage of PocketBase's no-code backend capabilities to manage poll data and user interactions. The frontend is built with React and styled using Chakra UI for a clean and responsive user interface. The application is designed to be simple and user-friendly, allowing users to quickly create and participate in polls without any barriers.

### Core Services

- **Poll Management Service**: Handles the creation, retrieval, and management of polls.
- **Options Management Service**: Manages the options for each poll.
- **Voting Service**: Handles the voting process and ensures that votes are counted correctly. Computes the results at the end of the voting period.
