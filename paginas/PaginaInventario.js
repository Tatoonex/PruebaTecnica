export class PaginaInventario {
  constructor(page) {
    this.page = page;
    this.titulo = page.locator('.title');
    this.productos = page.locator('.inventory_item');
    this.nombresProductos = page.locator('.inventory_item_name');
    this.precios = page.locator('.inventory_item_price');
    this.enlaceCarrito = page.locator('.shopping_cart_link');
    this.badgeCarrito = page.locator('.shopping_cart_badge');
    this.selectorOrden = page.locator('[data-test="product-sort-container"]');
  }

  async agregarProductosAlCarrito(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      await this.productos.nth(i).locator('button').click();
    }
  }

  async agregarProducto(indice) {
    await this.productos.nth(indice).locator('button').click();
  }

  async irAlCarrito() {
    await this.enlaceCarrito.click();
  }

  async ordenarPor(valor) {
    await this.selectorOrden.selectOption(valor);
  }

  async abrirDetalle(indice) {
    await this.nombresProductos.nth(indice).click();
  }
}
