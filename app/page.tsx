"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import Button from './components/Button';
import "./../app/app.css";

import outputs from "@/amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
const client = generateClient<Schema>();

Amplify.configure(outputs);

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { user } = useAuthenticator();

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }
    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main>
      <h1>Welcome back, {user?.signInDetails?.loginId}!</h1>
      <Button onClick={createTodo} variant="primary">+ new</Button>
      <ul>
        {todos.map(todo => <li
            onClick={() => deleteTodo(todo.id)}
            key={todo.id}>
            {todo.content}
          </li>)}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
    </main>
  );
}
