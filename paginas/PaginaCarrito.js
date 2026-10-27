export class PaginaCarrito {
  constructor(page) {
    this.page = page;
    this.items = page.locator('.cart_item');
    this.botonCheckout = page.locator('#checkout');
  }

  async irACheckout() {
    await this.botonCheckout.click();
  }

  async quitarProducto(indice) {
    await this.items.nth(indice).locator('button').click();
  }
}
