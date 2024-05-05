import { Category, type ICategory } from "../domain/model";
import type { ICategoryRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

export class FetchCategoryRepository extends BaseFetchModelRepository<Category, ICategory> implements ICategoryRepository {
  public reference() { return 'http://127.0.0.1:8787/categories' }

  public fromPayload(data: any): Category {
    const model = new Category(data)

    model.exists = true

    return model
  }
}
