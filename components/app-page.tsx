"use client";

import { useState, useEffect } from "react";
import { Clipboard, Pencil, Trash, Check, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    addTodo,
    deleteTodo,
    getTodos,
    updateTodo,
} from "@/lib/actions/redis.actions";

export function Page() {
    const [todos, setTodos] = useState<any[]>([]);
    const [newTodo, setNewTodo] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        const fetchTodos = async () => {
            const fetchedTodos = await getTodos();
            setTodos(fetchedTodos);
        };
        fetchTodos();
    }, []);

    const handleAddTodo = async (e: any) => {
        e.preventDefault();
        if (newTodo.trim()) {
            const todo = await addTodo(newTodo);
            setTodos([...todos, todo]);
            setNewTodo("");
            toast({
                title: "Link added",
                description: "Your new link has been added successfully.",
            });
        }
    };

    const handleUpdateTodo = async (id: string) => {
        if (editText.trim()) {
            const updatedTodo = await updateTodo(id, editText);
            setTodos(
                todos.map((todo) => (todo.id === id ? updatedTodo : todo))
            );
            setEditingId(null);
            toast({
                title: "Todo updated",
                description: "Your todo has been updated successfully.",
            });
        }
    };

    const handleDeleteTodo = async (id: string) => {
        await deleteTodo(id);
        setTodos(todos.filter((todo) => todo.id !== id));
        toast({
            title: "Todo deleted",
            description: "Your todo has been deleted successfully.",
        });
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied to clipboard",
            description: "The todo has been copied to your clipboard.",
        });
    };

    return (
        <div className='min-h-screen bg-gray-900 text-white'>
            <div className='container mx-auto p-4 max-w-2xl'>
                <Card className='bg-gray-800 border-gray-700'>
                    <CardHeader>
                        <CardTitle className='text-3xl font-bold text-center text-white'>
                            Clipboard App
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleAddTodo}
                            className='flex space-x-2 mb-4'
                        >
                            <Input
                                type='text'
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder='Add a new todo'
                                className='flex-grow bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                            />
                            <Button
                                type='submit'
                                className='bg-blue-600 hover:bg-blue-700'
                            >
                                <Plus className='h-4 w-4 mr-2' />
                                Add
                            </Button>
                        </form>
                        <ul className='space-y-4'>
                            {todos.map((todo) => (
                                <li
                                    key={todo.id}
                                    className='flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-700 rounded-lg shadow'
                                >
                                    <div className='flex-grow mb-2 sm:mb-0 sm:mr-4 break-all'>
                                        {editingId === todo.id ? (
                                            <Input
                                                value={editText}
                                                onChange={(e) =>
                                                    setEditText(e.target.value)
                                                }
                                                className='flex-grow mr-2 bg-gray-600 text-white border-gray-500 focus:border-blue-500'
                                            />
                                        ) : (
                                            <span className='flex-grow text-white'>
                                                {todo.text}
                                            </span>
                                        )}
                                    </div>
                                    <div className='flex space-x-2'>
                                        {editingId === todo.id ? (
                                            <>
                                                <Button
                                                    size='icon'
                                                    onClick={() =>
                                                        handleUpdateTodo(
                                                            todo.id
                                                        )
                                                    }
                                                    className='bg-green-600 hover:bg-green-700'
                                                >
                                                    <Check className='h-4 w-4' />
                                                </Button>
                                                <Button
                                                    size='icon'
                                                    variant='outline'
                                                    onClick={() =>
                                                        setEditingId(null)
                                                    }
                                                    className='border-gray-500 text-gray-300 hover:bg-gray-600'
                                                >
                                                    <X className='h-4 w-4' />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    size='icon'
                                                    variant='outline'
                                                    onClick={() =>
                                                        handleCopy(todo.text)
                                                    }
                                                    className='border-gray-500 text-gray-300 hover:bg-gray-600 dark'
                                                >
                                                    <Clipboard className='h-4 w-4' />
                                                </Button>
                                                <Button
                                                    size='icon'
                                                    variant='outline'
                                                    onClick={() => {
                                                        setEditingId(todo.id);
                                                        setEditText(todo.text);
                                                    }}
                                                    className='border-gray-500 text-gray-300 hover:bg-gray-600 dark'
                                                >
                                                    <Pencil className='h-4 w-4 ' />
                                                </Button>
                                                <Button
                                                    size='icon'
                                                    variant='outline'
                                                    onClick={() =>
                                                        handleDeleteTodo(
                                                            todo.id
                                                        )
                                                    }
                                                    className='border-gray-500 text-gray-300 hover:bg-gray-600 dark'
                                                >
                                                    <Trash className='h-4 w-4' />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
