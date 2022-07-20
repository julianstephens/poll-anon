import { gql } from "@apollo/client";

export const USER = gql`
  query User {
    user {
      name
      polls {
        title
      }
    }
  }
`;

export const POLL = gql`
  query Poll {
    poll(id: $pollId) {
      title
      description
      items {
        id
        name
      }
    }
  }
`

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        polls {
          title
          description
          items {
            id
            name
          }
        }
      }
    }
  }
`