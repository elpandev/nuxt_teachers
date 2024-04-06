import { BaseFilter, type IBaseFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface ITaskFilter extends IBaseFilter {

}

export class TaskFilter extends BaseFilter implements ITaskFilter {

}
