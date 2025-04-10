import { CredentialsMapper } from "@security/application/mappers/credential.mapper";
import { User } from "@security/domain/entity/user.entity";
import { UserModel } from "@security/infrastructure/persistence/models/user.model";
import { TaskStatus } from "@tasks/domain/entity/task-status.enum";
import { Task } from "@tasks/domain/entity/task.entity";
import { TaskModel } from "@tasks/infrastructure/persistence/models/task.model";

export class TaskMapper {
  static toDomain(model: TaskModel): Task {
    return new Task({
      id: model.id,
      title: model.title,
      description: model.description,
      status: model.status as TaskStatus,
      dueDate: new Date(model.dueDate),
      user: new User({
        id: model.user.id,
        fullName: model.user.fullName,
        role: model.user.role,
        credentials: model.user.credentials
          ? CredentialsMapper.toDomain(model.user.credentials)
          : null,
        tasks: model.user.tasks
          ? model.user.tasks.map((taskModel) => TaskMapper.toDomain(taskModel))
          : [],
      }),
    });
  }

  static toPersistence(task: Task): TaskModel {
    const model = new TaskModel();
    model.id = task.getId()!;
    model.title = task.getTitle();
    model.description = task.getDescription();
    model.status = task.getStatus() as TaskStatus;
    model.dueDate = task.getDueDate().toISOString();

    const user = new UserModel();
    user.id = task.getUser().getId()!;
    model.user = user;

    return model;
  }
}
