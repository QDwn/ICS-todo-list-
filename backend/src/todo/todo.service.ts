import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
  ) {}

  /* ================= GET ALL ================= */
  findAll() {
    return this.todoRepo.find({ order: { id: 'DESC' } });
  }

  /* ================= CREATE ================= */
  async create(data: {
    title: string;
    note?: string;
    icon?: string;
    startDate?: string | null;
    endDate?: string | null;
  }) {
    const todo = new Todo();

    todo.title = data.title;
    todo.note = data.note ?? null;
    todo.icon = data.icon || '✏️';
    todo.completed = false;

    todo.startDate = data.startDate ? new Date(data.startDate) : null;
    todo.endDate   = data.endDate   ? new Date(data.endDate)   : null;

    return this.todoRepo.save(todo);
  }



  /* ================= TOGGLE COMPLETED ================= */
  async toggle(id: number) {
    const todo = await this.todoRepo.findOneBy({ id });
    if (!todo) return;

    todo.completed = !todo.completed;
    return this.todoRepo.save(todo);
  }

  /* ================= UPDATE ================= */
  async update(id: number, data: Partial<Todo>) {
    const todo = await this.todoRepo.findOneBy({ id });
    if (!todo) return;

    if (data.title !== undefined) todo.title = data.title;
    if (data.note !== undefined) todo.note = data.note;
    if (data.icon !== undefined) todo.icon = data.icon;

    if ((data as any).startDate !== undefined) {
      todo.startDate = (data as any).startDate
        ? new Date((data as any).startDate)
        : null;
    }

    if ((data as any).endDate !== undefined) {
      todo.endDate = (data as any).endDate
        ? new Date((data as any).endDate)
        : null;
    }

    return this.todoRepo.save(todo);
  }

  /* ================= DELETE ================= */
  remove(id: number) {
    return this.todoRepo.delete(id);
  }
}
