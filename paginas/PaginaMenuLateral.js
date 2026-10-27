export class PaginaMenuLateral {
  constructor(page) {
    this.page = page;
    this.botonAbrir = page.locator('#react-burger-menu-btn');
    this.enlaceTodos = page.locator('#inventory_sidebar_link');
    this.enlaceCatalogoDinamico = page.locator('#dynamic_catalog_sidebar_link');
    this.enlaceAcercaDe = page.locator('#about_sidebar_link');
    this.enlaceCerrarSesion = page.locator('#logout_sidebar_link');
    this.enlaceReiniciarEstado = page.locator('#reset_sidebar_link');
  }

  async abrir() {
    for (let intento = 1; intento <= 3; intento++) {
      await this.botonAbrir.click();
      try {
        await this.enlaceCerrarSesion.waitFor({ state: 'visible', timeout: 5000 });
        return;
      } catch (error) {
        if (intento === 3) {
          throw error;
        }
      }
    }
  }

  async cerrarSesion() {
    await this.abrir();
    await this.enlaceCerrarSesion.click();
  }

  async reiniciarEstado() {
    await this.abrir();
    await this.enlaceReiniciarEstado.click();
  }

  async irAAcercaDe() {
    await this.abrir();
    await this.enlaceAcercaDe.click();
  }

  async irACatalogoDinamico() {
    await this.abrir();
    await this.enlaceCatalogoDinamico.click();
  }
}
