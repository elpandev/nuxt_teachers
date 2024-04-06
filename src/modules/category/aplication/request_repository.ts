import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { Category } from "../domain/model";
import type { ICategoryRepository } from "../domain/repository";

export class CategoryRequestRepository extends BaseModelRequestRepository<Category, ICategoryRepository> {

}
