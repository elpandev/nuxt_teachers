import type { IBaseModelRepository } from "~/elpandev/hexagonal/base/domain/repository";
import { Task } from "./model";

export interface ITaskRepository extends IBaseModelRepository<Task> {

}
