import type { ISelectOption } from "../presentation/interfaces/select_option";
import { ReportTemplateAdvanced } from "./report_templates/advanced";
import { ReportTemplateBasic } from "./report_templates/basic";

export const report_templates = [
  new ReportTemplateBasic(),
  new ReportTemplateAdvanced(),
]

export const report_template_options: ISelectOption[] =  report_templates
  .map(value => ({ key: value.type, name: value.name, value }))