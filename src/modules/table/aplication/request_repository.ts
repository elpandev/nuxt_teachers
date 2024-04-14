import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { Table } from "../domain/model";
import type { ITableRepository } from "../domain/repository";

export class TableRequestRepository extends BaseModelRequestRepository<Table, ITableRepository> {

}
