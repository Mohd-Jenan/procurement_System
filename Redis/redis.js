const {createClient}=require("redis")

const client=createClient({
    url:"redis://127.0.0.1:6379"
})
client.on("error",(err)=>{
    console.log("Redis error",err)
})

async function connectRedis(){
    try{
        await client.connect()
        console.log("Redis connected successfully")
    }
    catch(err){
        console.log("Redis is not connectedd",err)
    }
}
module.exports= {client,connectRedis}

