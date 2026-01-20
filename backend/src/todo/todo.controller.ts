import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getTodos() {
    return this.todoService.findAll();
  }

  @Post()
    createTodo(@Body() body: {
      title: string;
      note?: string;
      icon?: string;
      startDate?: string;
      endDate?: string;
    }) {
      return this.todoService.create(body);
    }

  @Patch(':id/toggle')
  toggleTodo(@Param('id') id: string) {
    return this.todoService.toggle(Number(id));
  }

  @Patch(':id')
    updateTodo(
      @Param('id') id: string,
      @Body() body: Partial<Todo>,
    ) {
      return this.todoService.update(Number(id), body);
    }
    @Delete(':id')
      deleteTodo(@Param('id') id: string) {
        return this.todoService.remove(Number(id));
      }

}
