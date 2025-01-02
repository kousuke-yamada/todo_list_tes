import React,{useState, useEffect} from "react";
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api';
import TodoItem from './components/TodoItem';
import type { Todo } from './types';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

type Filter = 'all' | 'completed' | 'unchecked' | 'delete';

//***** Todoコンポーネントの定義 *****//
const Todo: React.FC = () => {
  const [todos,setTodos] = useState<Todo[]>([]);
  const [text,setText] = useState('');
  const [nextId,setNextId] = useState(1);
  const [filter,setFilter] = useState<Filter>('all');

  const isFormDisabled = filter === 'completed'|| filter === 'delete';

  // コンポーネントマウント時にRail APIからデータを取得
  useEffect(() => {
    fetchTodos().then(data => setTodos(data));
  },[]);

  // Todoの追加ボタン押下時の処理
  const handleSubmit = () => {
    if(!text) return;  // 何も入力されていなかったらリターン
    
    const newTodo: Omit<Todo, 'id'> = {
      content: text,
      completed_flg: false,
      delete_flg: false,
      sort: 0,
    }

    createTodo(newTodo).then(data => {
      setTodos((prevTodos) => [data, ...prevTodos]);
      setNextId(nextId + 1);
      setText('');    // フォームのクリア
    });    
  };

  const handleDragEnd = (result: DropResult) => {
    if(!result.destination){
      console.log("ドラッグがキャンセルされました。");
      return;
    }

    const newTodos = Array.from(todos);
    const [movedTodo] = newTodos.splice(result.source.index, 1);
    newTodos.splice(result.destination.index, 0, movedTodo);

    // 並び替え後のUIを即時更新
    setTodos(newTodos);
    console.log("並び替え後のTodos:", newTodos);

    //　サーバー側に並び替え結果を非同期で送信
    newTodos.forEach((todo,index) => {
      todo.sort = index + 1;
      updateTodo(todo.id, todo).catch((error) => {
        console.error(`Todo ${todo.id}の更新に失敗しました：`, error);
      });
    });
  };

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
      case 'delete':    // 削除済
        return todos.filter((todo) => todo.delete_flg)
      default:
        return todos.filter((todo) => !todo.delete_flg)
    };
  };
  // 削除対象のタスクリストを取得する処理
  const handleEmpty = () =>{
    const filteredTodos = todos.filter(todo => !todo.delete_flg);
    const deletePromises = todos.filter(todo => todo.delete_flg)
    .map(todo => deleteTodo(todo.id));
    
    Promise.all(deletePromises).then(() => setTodos(filteredTodos));
  }

  return (
    <div className = "todo-container">
      <select
       defaultValue="all"
       onChange={(e) => handleFilterChange(e.target.value as Filter)}
      >
        <option value="all">全てのタスク</option>
        <option value="completed">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="delete">ゴミ箱</option>
      </select>

      {filter === 'delete' && (
        <button onClick={handleEmpty}>ゴミ箱を空にする</button>
      )}
      {filter !== 'completed' && (
        <form
          onSubmit={(e) => {
          e.preventDefault();   // フォームのデフォルト動作を防ぐ
          handleSubmit();
        }}
        >
          <input
            type="text"
            value={text}            
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">追加</button>
        </form>
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {getFilteredTodos().map((todo, index) => (
                <Draggable
                  key={todo.id}
                  draggableId={String(todo.id)}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <TodoItem
                      todo={todo}
                      updateTodo={updateTodo}
                      setTodos={setTodos}
                      todos={todos}
                      index={index}
                      provided={provided}
                      snapshot={snapshot}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Todo;