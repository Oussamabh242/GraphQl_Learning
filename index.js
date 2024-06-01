import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import pool from './db.js';

//types
import { typeDefs } from './schema.js';

//Resolvers 
const resolvers = {
    Query : {
        tweets(){
            return pool.query("select * from tweets;")
            .then(res=>{ return res.rows})
            .catch(err => {throw(err)})
                
            
        },
        users(){
            return pool.query("select * from users;")
            .then(res=>{ return res.rows})
            .catch(err => {throw(err)})
                
        },
        comments(){
            return pool.query("select * from comments;")
            .then(res=>{ return res.rows})
            .catch(err => {throw(err)})
                
            
        },

        tweet(_ , args){
            return pool.query("select * from tweets where tweet_id =$1 ;" , [parseInt(args.id)])
            .then(res=>{ return res.rows[0]})
            .catch(err => {throw(err)})
        },
        comment(_ , args){
            return pool.query("select * from comments where comment_id =$1 ;" , [parseInt(args.id)])
            .then(res=>{ return res.rows[0]})
            .catch(err => {throw(err)})
        },
        user(_ , args){
            return pool.query("select * from users where user_id =$1 ;" , [parseInt(args.id)])
            .then(res=>{ return res.rows[0]})
            .catch(err => {throw(err)})
        }
        
    },
    User: {
        tweets(parent){
            return pool.query("select * from tweets where user_id =$1 ;" , [parseInt(parent.user_id)])
            .then(res=>{ return res.rows})
            .catch(err => {throw(err)})
        }
    }
}

//server setup
const server = new ApolloServer({
    //TypeDefs
    typeDefs,
    //Resolver
    resolvers
})

const {url} = await startStandaloneServer(server , {
    listen: {port:4000}
}) ; 

console.log("server is running on port",4000)