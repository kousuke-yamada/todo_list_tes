import type { Todo } from './types';

//RAILS APIとの接続URL
const RAILS_API_URL = "http://localhost:3031/api/v1/todos";
// HTTPヘッダー情報
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

// APIからTodoデータ取得
export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch(RAILS_API_URL);
  return response.json();
};
// Todoデータの新規作成をAPIへ通知
export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await fetch(RAILS_API_URL, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(todo),
  });
  return response.json();
};
// Todoデータの更新をAPIへ通知
export const updateTodo = async (id: number, updateTodo: Partial<Todo>): Promise<Todo> => {
  const response = await fetch(`${RAILS_API_URL}/${id}`,{
    method: "PATCH",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(updateTodo),
  });
  return response.json();
};
// Todoデータの削除をAPIへ通知
export const deleteTodo = async (id: number): Promise<void> => {
  await fetch(`${RAILS_API_URL}/${id}`,{
    method: "DELETE",
  });
};