import { ReportTemplate, ReportTemplateTypeEnum, type IReportTemplateDownload } from "../../modules/report/domain/values/template";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export class ReportTemplateAdvanced extends ReportTemplate {
  public name:        string = 'Avanzada'
  public description: string = 'Plantilla Avanzada de Uso Escolar'
  public type:        ReportTemplateTypeEnum = ReportTemplateTypeEnum.ADVANCED

  public async download(data: IReportTemplateDownload): Promise<void> {
    const doc = new jsPDF();
    const dx  = doc.internal.pageSize.width  || doc.internal.pageSize.getWidth();
    const dy  = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();

    doc.text('Colegio Alcazares de Nuble', dx/2, 12, { align: "center" })
    doc.text('INFORME DE NOTAS PARCIALES', dx/2, 18, { align: "center" })
    doc.text('Nombre: Francisco Moncayo', 12, 24)
    doc.text('Curso: Sexto de Básica',    12, 30)
    doc.text('Nombre: Francisco Moncayo', 12, 36)

    autoTable(doc, {
      margin: { top: 64 },
      head: [['Name', 'Email', 'Country']],
      body: [
        ['David', 'david@example.com', 'Sweden'],
        ['Castille', 'castille@example.com', 'Spain'],
        // ...
      ],
    })
  
    doc.save("a4.pdf");
  }
}
