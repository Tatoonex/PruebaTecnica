import { test, expect } from '@playwright/test';
import { PaginaInicioSesion } from '../paginas/PaginaInicioSesion';
import { PaginaInventario } from '../paginas/PaginaInventario';

test.describe('Inicio de sesión - saucedemo.com', () => {

  test('inicio de sesión true - credenciales válidas', async ({ page }) => {
    const paginaInicioSesion = new PaginaInicioSesion(page);
    const paginaInventario = new PaginaInventario(page);

    await paginaInicioSesion.visitar();
    await paginaInicioSesion.iniciarSesion('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(paginaInventario.titulo).toHaveText('Products');
  });

  test('inicio de sesión false - credenciales inválidas', async ({ page }) => {
    const paginaInicioSesion = new PaginaInicioSesion(page);

    await paginaInicioSesion.visitar();
    await paginaInicioSesion.iniciarSesion('usuario_invalido', 'password_incorrecto');

    await expect(page).toHaveURL(paginaInicioSesion.sitio);
    await expect(paginaInicioSesion.mensajeError).toBeVisible();
    await expect(paginaInicioSesion.mensajeError).toContainText(
      'Username and password do not match any user in this service'
    );
  });

  test('inicio de sesión - usuario bloqueado', async ({ page }) => {
    const paginaInicioSesion = new PaginaInicioSesion(page);

    await paginaInicioSesion.visitar();
    await paginaInicioSesion.iniciarSesion('locked_out_user', 'secret_sauce');

    await expect(page).toHaveURL(paginaInicioSesion.sitio);
    await expect(paginaInicioSesion.mensajeError).toContainText(
      'Sorry, this user has been locked out'
    );
  });

  test('inicio de sesión - campos vacíos', async ({ page }) => {
    const paginaInicioSesion = new PaginaInicioSesion(page);

    await paginaInicioSesion.visitar();
    await paginaInicioSesion.botonIngresar.click();

    await expect(paginaInicioSesion.mensajeError).toContainText('Username is required');
  });

});
