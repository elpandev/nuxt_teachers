import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { GradeRegisterAggregate } from "../domain/model";
import type { IGradeRegisterAggregateRepository } from "../domain/repository";

export class GradeRegisterAggregateRequestRepository extends BaseModelRequestRepository<GradeRegisterAggregate, IGradeRegisterAggregateRepository> {

}
