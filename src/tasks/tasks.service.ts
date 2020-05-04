import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task-status-enum';
import { UserEntity } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(
    filterDto: GetTasksFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: UserEntity): Promise<TaskEntity> {
    const found = await this.taskRepository.findOne({
      where: { id: id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return found;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const { title, description } = createTaskDto;
    const task = await this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.taskRepository.save(task);

    delete task.user; // deleting the user from the response object

    return task;
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(id: number, user: UserEntity): Promise<void> {
    const task = await this.getTaskById(id, user);
    await this.taskRepository.delete(task);
  }
}
