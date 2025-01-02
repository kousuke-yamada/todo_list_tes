import { Todo } from './todo';

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch("http://localhost:3031/api/v1/todos");
  return response.json();
};

export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await fetch("http://localhost:3031/api/v1/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  return response.json();
};

export const updateTodo = async (id: number, updateTodo: Partial<Todo>): Promise<Todo> => {
  const response = await fetch(`http://localhost:3031/api/v1/todos/${id}`,{
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateTodo),
  });
  return response.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  await fetch(`http://localhost:3031/api/v1/todos/${id}`,{
    method: "DELETE",
  });
};