import type { Attendance } from "~/src/modules/attendance/domain/model";
import { BaseReportTemplate } from "./report_template";

export interface IBaseReportTemplateAttendance {
  institution_name: string
  name: string
  description: string
  student_name: string
  course_name: string
  attendances: Attendance[]
}

export abstract class BaseReportTemplateAttendance extends BaseReportTemplate<IBaseReportTemplateAttendance> {

}
