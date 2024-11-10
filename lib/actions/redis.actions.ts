"use server";

import Redis from "ioredis";
import { revalidatePath } from "next/cache";
import { connectRedis } from "../redis";

// Function to connect to Redis
// export async function connectRedis() {
//     const redis = new Redis({
//         host: process.env.REDIS_HOST!,
//         port: Number(process.env.REDIS_PORT),
//     });
//     return redis;
// }

export async function addItem({
    text,
    type,
}: {
    text: string;
    type: "link" | "image" | "text";
}) {
    const id = Date.now().toString();
    const redis = await connectRedis();
    await redis.hset(
        "clipboard",
        id,
        JSON.stringify({ id, content: text, type: type })
    );
    revalidatePath("/");

    return {
        id: id,
        type: type,
        content: text,
    };
}

export async function updateItem(id: string, text: string) {
    const redis = await connectRedis();
    const todo = await redis.hget("clipboard", id);
    if (todo) {
        await redis.hset(
            "clipboard",
            id,
            JSON.stringify({ id, content: text, type: "link" })
        );
        revalidatePath("/");
        const data: { id: string; type: "link"; content: string } = {
            id: id,
            type: "link",
            content: text,
        };
        return data;
    }
}

export async function deleteItem(id: string) {
    const redis = await connectRedis();
    await redis.hdel("clipboard", id);
    revalidatePath("/");
}

export async function getItems() {
    const redis = await connectRedis();
    const clipboard = await redis.hgetall("clipboard");
    return Object.values(clipboard).map((todo) => JSON.parse(todo as string));
}
