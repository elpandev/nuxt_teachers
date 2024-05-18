import { BACKEND_URL, ENV } from "~/src/config/env";
import { Category, type ICategory } from "../domain/model";
import type { ICategoryRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

interface ICategoryPayload extends ICategory {}

export class FetchCategoryRepository extends BaseFetchModelRepository<Category, ICategoryPayload> implements ICategoryRepository {
  public reference() { return `${BACKEND_URL[ENV]}/categories` }

  public fromPayload(payload: ICategoryPayload): Category {
    const model = new Category(payload)

    model.exists = true

    return model
  }

  public toPayload(model: Category): Partial<ICategoryPayload> {
    return model.toPayload()
  }
}
