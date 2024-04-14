import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { Column } from "../domain/model";
import type { IColumnRepository } from "../domain/repository";

export class ColumnRequestRepository extends BaseModelRequestRepository<Column, IColumnRepository> {

}
