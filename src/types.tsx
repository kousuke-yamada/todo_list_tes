//***** Todo型の定義 *****//
export interface Todo {
  content: string;          // Todo内容
  readonly id: number;      // Todo id
  completed_flg: boolean;   // 完了済フラグ
  delete_flg: boolean;      // 削除フラグ
  sort: number;             // ソート用
}