export class PaginaDetalleProducto {
  constructor(page) {
    this.page = page;
    this.nombre = page.locator('.inventory_details_name, [data-test="inventory-item-name"]').first();
    this.botonVolver = page.locator('#back-to-products');
  }

  async volver() {
    await this.botonVolver.click();
  }
}
