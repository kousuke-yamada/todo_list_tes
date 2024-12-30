import React,{useState} from "react";

type Todo ={
  content: string;
  readonly id: number;
  completed_flg: boolean;
  delete_flg: boolean;
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
      completed_flg: false,
      delete_flg: false,
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
      return newTodos;
    })
  }

  const handleCheck = (id: number, completed_flg: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if(todo.id === id){
          return { ...todo, completed_flg};
        }
        return todo;
      })
      return newTodos;
    })    
  };

  const handleRemove = (id: number, delete_flg: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if(todo.id === id){
          return {...todo, delete_flg}
        }
        return todo;
      });
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
              type="checkbox"
              checked={todo.completed_flg}
              onChange={() => handleCheck(todo.id, !todo.completed_flg)}
              />
              <input
              type="text"
              value={todo.content}
              disabled={todo.completed_flg}
              onChange={(e) => handleEdit(todo.id, e.target.value)}
              />
              <button onClick={() => handleRemove(todo.id, !todo.delete_flg)}>
                {todo.delete_flg ? '復元': '削除'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Todo;