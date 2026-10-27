export class PaginaDatosCheckout {
  constructor(page) {
    this.page = page;
    this.campoNombre = page.locator('#first-name');
    this.campoApellido = page.locator('#last-name');
    this.campoCodigoPostal = page.locator('#postal-code');
    this.botonContinuar = page.locator('#continue');
    this.botonCancelar = page.locator('#cancel');
    this.mensajeError = page.locator('[data-test="error"]');
  }

  async completarDatos(nombre, apellido, codigoPostal) {
    await this.campoNombre.fill(nombre);
    await this.campoApellido.fill(apellido);
    await this.campoCodigoPostal.fill(codigoPostal);
    await this.botonContinuar.click();
  }
}
