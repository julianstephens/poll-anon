import { gql } from "@apollo/client";

export const USER = gql`
  query User {
    user(id: 1) {
      name
      polls {
        title
      }
    }
  }
`;
