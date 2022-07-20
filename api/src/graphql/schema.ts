const typeDefs = /* GraphQL */`
    type User {
        id: Int!
        name: String!
        email: String!
        polls: [Poll]
        starredPolls: [Poll]
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Poll {
        id: Int!
        title: String!
        description: String
        expDate: DateTime
        showResults: Boolean!
        slug: String!
        owner: User!
        items: [PollItem]
    }

    input PollCreateInput {
        title: String!
        description: String
        expDate: DateTime
        showResults: Boolean
    }

    input PollUpdateInput {
        id: Int!
        title: String
        description: String
        expDate: DateTime
        showResults: Boolean
    }

    type PollItem {
        id: Int!
        name: String!
        rank: Int
        numVotes: Int!
        poll: Poll!
    }

    input PollItemCreateInput {
        name: String!
        pollId: Int!
    }

    input PollItemUpdateInput {
        id: Int!
        name: String!
    }

    type Query {
        user: User
        poll(id: String!): Poll
    }

    type Mutation {
        signup(email: String!, password: String!, name: String!): AuthPayload
        login(email: String!, password: String!): AuthPayload
        createPoll(data: PollCreateInput!): Poll
        updatePoll(data: PollUpdateInput!): Poll
        starPoll(id: Int!): Poll
        createPollItem(data: PollItemCreateInput!): PollItem
        updatePollItem(data: PollItemUpdateInput!): PollItem
        deletePollItem(id: Int!): PollItem
    }

    scalar DateTime
`

export default typeDefs