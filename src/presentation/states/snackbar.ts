import { nano_id } from "@/elpandev/utils/methods/nano_id";

enum SnackbarTypeEnum {
  ERROR   = 'error',
  WARNING = 'warning',
  SUCCESS = 'success',
}

export interface ISnackbar {
  id:      string
  type:    SnackbarTypeEnum
  message: string
}

class Snackbar {
  public snackbars: ISnackbar[] = []

  private push(type: SnackbarTypeEnum, message: string) {
    const id = nano_id()

    this.snackbars.push({ id, type, message })

    setTimeout(() => this.destroy(id), 8000);
  }

  public error  (message: string) { this.push(SnackbarTypeEnum.ERROR,   message) }
  public warning(message: string) { this.push(SnackbarTypeEnum.WARNING, message) }
  public success(message: string) { this.push(SnackbarTypeEnum.SUCCESS, message) }

  public destroy(id: string) {
    this.snackbars.removeWhere(element => element.id == id)
  }

  public product_attached_to_cart(name: string, variant_name: string) {
    this.push(SnackbarTypeEnum.SUCCESS, `El producto "${name} / ${variant_name}" ha sido agregado al carrito`)
  }

  public invalid_cupon() {
    this.push(SnackbarTypeEnum.ERROR, `El código del cupón es inválido`)
  }
}

export const snackbar = new Snackbar()

export const useSnackbar = () => useState('snackbar', () => snackbar)