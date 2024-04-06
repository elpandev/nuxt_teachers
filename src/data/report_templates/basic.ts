import { ReportTemplate, ReportTemplateTypeEnum, type IReportTemplateDownload } from "../../modules/report/domain/values/template"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export class ReportTemplateBasic extends ReportTemplate {
  public name:        string = 'Básica'
  public description: string = 'Plantilla Básica de Uso Escolar'
  public type:        ReportTemplateTypeEnum = ReportTemplateTypeEnum.BASIC

  public async download(data: IReportTemplateDownload): Promise<void> {
    const doc = new jsPDF();
    const dx  = doc.internal.pageSize.width  || doc.internal.pageSize.getWidth();
    const dy  = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();

    doc.text(data.institution_name, dx/2, 12, { align: "center" })
    doc.text(data.name, dx/2, 18, { align: "center" })
    doc.text(data.description, dx/2, 24, { align: "center", maxWidth: dx - 24 })

    doc.text(`Nombre: ${data.student_name}`, 12, 30)
    doc.text(`Curso: ${data.course_name}`,    12, 36)

    autoTable(doc, {
      margin: { top: 64 },
      head: [data.scores.columns],
      body: data.scores.rows.map(e => ([e.name, ...e.values])),
    })
  
    doc.save("a4.pdf");
  }
}
