import path from 'path';
import os from 'os';

export class PaginaConfirmacionCompra {
  constructor(page) {
    this.page = page;
    this.encabezado = page.locator('.complete-header');
    this.mensaje = page.locator('.complete-text');
    this.botonGenerarPdf = page.locator('#generate-pdf-order');
  }

  async descargarComprobantePdf() {
    const [descarga] = await Promise.all([
      this.page.waitForEvent('download'),
      this.botonGenerarPdf.click(),
    ]);
    const rutaArchivo = path.join(os.homedir(), 'Downloads', descarga.suggestedFilename());
    await descarga.saveAs(rutaArchivo);
    return rutaArchivo;
  }
}
