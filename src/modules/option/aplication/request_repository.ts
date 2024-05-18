import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { Option } from "../domain/model";
import type { IOptionRepository } from "../domain/repository";

export class OptionRequestRepository extends BaseModelRequestRepository<Option, IOptionRepository> {
  
}
