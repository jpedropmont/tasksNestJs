import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task-status-enum';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getAllTasks(): Promise<TaskEntity[]> {
    return await this.taskRepository.find();
  }

  /*
  getTasksByFilter(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }
  */

  async getTaskById(id: number): Promise<TaskEntity> {
    const found = await this.taskRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const { title, description } = createTaskDto;
    const task = await this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.taskRepository.save(task);
    return task;
  }

  async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    const { title, description } = updateTaskDto;
    const task = await this.getTaskById(id);

    if (title) {
      task.title = title;
    }

    if (description) {
      task.description = description;
    }

    await this.taskRepository.update(id, task);

    return task;
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<TaskEntity> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
}
