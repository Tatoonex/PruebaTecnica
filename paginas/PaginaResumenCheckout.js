export class PaginaResumenCheckout {
  constructor(page) {
    this.page = page;
    this.botonFinalizar = page.locator('#finish');
    this.totalPagar = page.locator('.summary_total_label');
  }

  async finalizarCompra() {
    await this.botonFinalizar.click();
  }
}
