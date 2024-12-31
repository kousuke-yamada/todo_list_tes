import React,{useState, useEffect} from "react";
import localforage from 'localforage';

//***** 型の定義 *****//
type Todo ={
  content: string;
  readonly id: number;
  completed_flg: boolean;
  delete_flg: boolean;
};
type Filter = 'all' | 'completed' | 'unchecked' | 'delete';

//***** Todoコンポーネントの定義 *****//
const Todo: React.FC = () => {
  const [todos,setTodos] = useState<Todo[]>([]);
  const [text,setText] = useState('');
  const [nextId,setNextId] = useState(1);
  const [filter,setFilter] = useState<Filter>('all');

  const isFormDisabled = filter === 'completed'|| filter === 'delete';

  // Todoオブジェクトのプロパティ更新処理
  const  handleTodo = <K extends keyof Todo, V extends Todo[K]>(
    id: number,
    key: K,
    value: V
  ) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if(todo.id === id){
          return {...todo, [key]: value};          
        }else{
          return todo;
        }
      });
      return newTodos;
    });
  };

  // Todoの追加ボタン押下時の処理
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
    setText('');    // フォームのクリア
  }
  // Todoのフィルター（セレクトボックス）変更時の処理
  const handleFilterChange = (filter: Filter) => {
    setFilter(filter);
  };
  // フィルタリングされたタスクリストを取得する処理
  const getFilteredTodos = () => {
    switch(filter){
      case 'completed': //完了済
        return todos.filter((todo) => todo.completed_flg && !todo.delete_flg);
      case 'unchecked': //未完了
        return todos.filter((todo) => !todo.completed_flg && !todo.delete_flg)
      case 'delete':  // 削除済
        return todos.filter((todo) => todo.delete_flg)
      default:
        return todos.filter((todo) => !todo.delete_flg)
    };
  };
  // 削除対象のタスクリストを取得する処理
  const handleEmpty = () =>{
    setTodos((todos) => todos.filter((todo) => !todo.delete_flg));
  }

  // コンポーネントのマウント時にデータを取得
  useEffect(() => {
    localforage.getItem('todo-20240622').then((values) => {
      if (values) {
        setTodos(values as Todo[]);
      }
    });
  }, []);
  // todosステートが更新されるたびにデータを保存
  useEffect(() => {
    localforage.setItem('todo-20240622', todos);
  }, [todos]);

  return (
    <div className = "todo-container">
      <select defaultValue="all" onChange={(e) => handleFilterChange(e.target.value as Filter)}>
        <option value="all">全てのタスク</option>
        <option value="completed">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="delete">ゴミ箱</option>
      </select>
      {filter === 'delete' ? (
        <button onClick={handleEmpty}>ゴミ箱を空にする</button>
        ):(
          filter !== 'completed' && (
            <form 
            onSubmit={(e) => {
              e.preventDefault();   // フォームのデフォルト動作を防ぐ
              handleSubmit();       // handleSubmit関数をコール
            }}
            >
              <input
              type="text"
              value={text}
              disabled={isFormDisabled}
              onChange={(e) => setText(e.target.value)}
              />
              <input type="submit" value="追加" />
            </form>
          )
        )}      
      <ul>
        {getFilteredTodos().map((todo) => (          
            <li key={todo.id}>
              <input
              type="checkbox"
              checked={todo.completed_flg}
              onChange={() => handleTodo(todo.id, 'completed_flg', !todo.completed_flg)}
              />
              <input
              type="text"
              value={todo.content}
              disabled={todo.completed_flg}
              onChange={(e) => handleTodo(todo.id, 'content', e.target.value)}
              />
              <button onClick={() => handleTodo(todo.id, 'delete_flg', !todo.delete_flg)}>
                {todo.delete_flg ? '復元': '削除'}
              </button>
            </li>          
        ))}
      </ul>
    </div>
  );
};

export default Todo;