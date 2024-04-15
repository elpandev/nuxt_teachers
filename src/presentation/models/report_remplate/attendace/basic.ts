import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { BaseReportTemplateAttendance, type IBaseReportTemplateAttendance } from "~/src/presentation/base/report_template_attendance";

export class ReportTemplateAttendanceBasic extends BaseReportTemplateAttendance {
  public name:        string = 'Básica'
  public description: string = 'Plantilla Básica de Uso Escolar'

  public async download(data: IBaseReportTemplateAttendance): Promise<void> {
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
      head: [['Nombre', 'Estado']],
      body: data.attendances.map(e => ([e.name, 'Presente'])),
    })
  
    doc.save("a4.pdf");
  }
}
