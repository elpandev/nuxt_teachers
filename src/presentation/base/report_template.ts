export abstract class BaseReportTemplate<T = any> {
  abstract name:        string
  abstract description: string

  abstract download(data: T): Promise<void>
}
