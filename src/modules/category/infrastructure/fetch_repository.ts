import { BACKEND_URL, ENV } from "~/src/config/env";
import { Category, type ICategory } from "../domain/model";
import type { ICategoryRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

export class FetchCategoryRepository extends BaseFetchModelRepository<Category, ICategory> implements ICategoryRepository {
  public reference() { return `${BACKEND_URL[ENV]}/categories` }

  public fromPayload(data: any): Category {
    const model = new Category(data)

    model.exists = true

    return model
  }
}
