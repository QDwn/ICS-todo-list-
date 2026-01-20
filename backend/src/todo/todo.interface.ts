// todo-backend/src/todo/todo.interface.ts
export interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
  note?: string;
  startDate?: string;
  endDate?: string;
}