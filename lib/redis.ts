// import { createClient, RedisClientType } from "redis"; // Ensure RedisClientType is available

// // Define `conn` with an appropriate type
// let redis: { conn: RedisClientType | null } = { conn: null };

// export const connectRedis = async (): Promise<RedisClientType> => {
//     if (redis.conn) {
//         return redis.conn;
//     } else {
//         const client = createClient();
//         client.on("error", (err) => {
//             console.error("Redis Client Error:", err);
//         });
//         redis.conn = (await client.connect()) as any;
//         return redis.conn as any;
//     }
// };

import Redis from "ioredis";
let redisConn: { conn: null } = { conn: null };

export const connectRedis = async (): Promise<any> => {
    if (redisConn.conn) {
        return redisConn.conn;
    } else {
        try {
            // const redis: any = new Redis();
            const redis: any = new Redis({
                host: process.env.REDIS_HOST!,
                port: Number(process.env.REDIS_PORT),
            });
            redisConn.conn = redis;
            return redisConn.conn as any;
        } catch (error) {
            console.log(error);
        }
    }
};
