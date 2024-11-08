"use server";

import Redis from "ioredis";
import { revalidatePath } from "next/cache";

// Function to connect to Redis
export async function connectRedis() {
    const redis = new Redis({
        host: process.env.REDIS_HOST || "localhost", // Use environment variable or default to localhost
        port: parseInt(process.env.REDIS_PORT!) || 6379, // Use environment variable or default to 6379
    });
    return redis;
}

export async function addTodo(text: string) {
    const id = Date.now().toString();
    const redis = await connectRedis();
    await redis.hset("todos", id, JSON.stringify({ id, text })); // Change hSet to hset and use id as the field
    revalidatePath("/");
    return { id: id, text: text };
}

export async function updateTodo(id: string, text: string) {
    const redis = await connectRedis();
    const todo = await redis.hget("todos", id); // Change hGet to hget
    if (todo) {
        await redis.hset("todos", id, JSON.stringify({ id, text })); // Change hSet to hset and use id as the field
        revalidatePath("/");
        return { id: id, text: text };
    }
}

export async function deleteTodo(id: string) {
    const redis = await connectRedis();
    await redis.hdel("todos", id); // Change hDel to hdel
    revalidatePath("/");
}

export async function getTodos() {
    const redis = await connectRedis();
    const todos = await redis.hgetall("todos"); // Change hGetAll to hgetall
    return Object.values(todos).map((todo) => JSON.parse(todo as string));
}
