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
            const { tweet_id, content } = args;
            let index = 1 ; 
            let values = [] ; 
            let query = "select * from tweets where 1=1 "
            if(tweet_id) {
                query+=` AND tweet_id = $${index++} `
                values.push(tweet_id) ;
            }
            if(content){
                query+= ` AND content LIKE $${index++} ;`
                values.push("%"+content+"%") ; 
            }

            

            return pool.query(query, values)
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
        },
        comments(parent){
            return pool.query("select * from comments where user_id =$1 order by created_at;" , [parseInt(parent.user_id)])
            .then(res=>{ return res.rows})
            .catch(err => {throw(err)})
        }
    },
    Tweet : {
        user(parent){
            return pool.query("select * from users where user_id =$1 ;" , [parseInt(parent.user_id)])
            .then(res=>{ return res.rows[0]})
            .catch(err => {throw(err)})
        },
        comments(parent){
            return pool.query("select * from comments where tweet_id =$1 ;" , [parseInt(parent.tweet_id)])
            .then(res=>{ return res.rows})
            .catch(err => {throw(err)})
        }
    } , 
    Comment:{
        user(parent){
            return pool.query("select * from users where user_id =$1 ;" , [parseInt(parent.user_id)])
            .then(res=>{ return res.rows[0]})
            .catch(err => {throw(err)})
        },
        tweet(parent){
            return pool.query("select * from tweets where tweet_id =$1 ;" , [parseInt(parent.tweet_id)])
            .then(res=>{ return res.rows[0]})
            .catch(err => {throw(err)})
        }
    },
    Mutation : {
        deleteComment(_,args){
                return pool.query("DELETE from comments where comment_id =$1 ;" , [parseInt(args.comment_id)])
                .then(res=>{console.log(res)  ;return res.command+"D "+res.rowCount+" rows."})
                .catch(err => {throw(err)})
        },
        addTweet(_,args){
            const tweet = {
                ...args.tweet 
            }
            return pool.query("INSERT INTO tweets(content , user_id) values($1,$2)" , [tweet.content ,parseInt(tweet.user_id)])
            .then(res=>{console.log(res)  ;return res.command+"D "+res.rowCount+" rows."})
            .catch(err => {throw(err)});
        },
        updateTweet(_,args){
            const utweet ={
                ...args.utweet
            }
            return pool.query("update tweets set content = $1 where tweet_id = $2 ;" , [utweet.content ,parseInt(utweet.tweet_id)])
            .then(res=>{console.log(res)  ;return res.command+"D "+res.rowCount+" rows."})
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

export const  res = resolvers ;