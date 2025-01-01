//***** Todo型の定義 *****//
export interface Todo {
  content: string;
  readonly id: number;
  completed_flg: boolean;
  delete_flg: boolean;
  sort: number;
}