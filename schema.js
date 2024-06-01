export const typeDefs = `#graphql
    type Tweet{
        tweet_id : ID!,
        content : String! ,
        created_at : String!
        user : User
        comments : [Comment!]
    }

    type User{
        user_id :ID!, 
        email : String!,
        password : String!,
        created_at : String!
        tweets : [Tweet!]
        comments: [Comment]
    }

    type Comment{
        comment_id : ID!,
        content : String! ,
        created_at : String!
        tweet : Tweet
        user : User 
    }

    type Query{
        tweets : [Tweet]
        tweet(id: ID!):  Tweet
        users : [User]
        user(id: ID!):  User
        comments: [Comment]
        comment(id: ID!):  Comment
    }


`