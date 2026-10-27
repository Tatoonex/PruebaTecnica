export class PaginaInicioSesion {
  constructor(page) {
    this.page = page;
    this.sitio = 'https://www.saucedemo.com/';
    this.campoUsuario = page.locator('#user-name');
    this.campoContrasena = page.locator('#password');
    this.botonIngresar = page.locator('#login-button');
    this.mensajeError = page.locator('[data-test="error"]');
  }

  async visitar() {
    await this.page.goto(this.sitio);
  }

  async iniciarSesion(usuario, contrasena) {
    await this.campoUsuario.fill(usuario);
    await this.campoContrasena.fill(contrasena);
    await this.botonIngresar.click();
  }
}
