import React,{useState} from "react";

type Todo ={
  content: string;
  readonly id: number;
};

// Todoコンポーネントの定義
const Todo: React.FC = () => {
  const [todos,setTodos] = useState<Todo[]>([]);
  const [text,setText] = useState('');
  const [nextId,setNextId] = useState(1);

  const handleSubmit = () =>{
    // 何も入力されていなかったらリターン
    if(!text) return;
    // 新しいTodoを作成
    const newTodo: Todo = {
      content: text,
      id: nextId,
    }
    // 更新前のtodosステートを元にスプレッド構文で展開した要素へnewTodoを加えた新しい配列でステートを更新
    setTodos((prevTodos)=>[newTodo, ...prevTodos]);
    setNextId(nextId + 1);
    // フォームのクリア
    setText('');    
  }

  const handleEdit = (id:number, value: string) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if(todo.id == id){
          return {...todo, content: value}
        }
        return todo;
      });
      // todosステート更新
      return newTodos;
    })
  }

  return (
    <div>
      <form 
      onSubmit={(e) => {
        e.preventDefault();   // フォームのデフォルト動作を防ぐ
        handleSubmit();       // handleSubmit関数をコール
      }}
      >
        <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        />
        <input type="submit" value="追加" />
      </form>
      <ul>
        {todos.map((todo) => {
          return (
            <li key={todo.id}>
              <input
              type="text"
              value={todo.content}
              onChange={(e) => handleEdit(todo.id, e.target.value)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Todo;