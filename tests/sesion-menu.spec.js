import { test, expect } from '@playwright/test';
import { PaginaInicioSesion } from '../paginas/PaginaInicioSesion';
import { PaginaInventario } from '../paginas/PaginaInventario';
import { PaginaMenuLateral } from '../paginas/PaginaMenuLateral';

test('acceso directo a inventory sin sesión redirige a login', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');

  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.locator('[data-test="error"]')).toContainText(
    "You can only access '/inventory.html' when you are logged in"
  );
});

test.describe('Menú lateral', () => {

  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const paginaInicioSesion = new PaginaInicioSesion(page);
    await paginaInicioSesion.visitar();
    await paginaInicioSesion.iniciarSesion('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('logout vuelve a login y bloquea el acceso directo', async ({ page }) => {
    const paginaMenuLateral = new PaginaMenuLateral(page);

    await paginaMenuLateral.cerrarSesion();
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('reset app state vacía el carrito', async ({ page }) => {
    const paginaInventario = new PaginaInventario(page);
    const paginaMenuLateral = new PaginaMenuLateral(page);

    await paginaInventario.agregarProductosAlCarrito(2);
    await expect(paginaInventario.badgeCarrito).toHaveText('2');

    await paginaMenuLateral.reiniciarEstado();
    await expect(paginaInventario.badgeCarrito).toHaveCount(0);
  });

  test('about navega al sitio externo de Sauce Labs', async ({ page }) => {
    const paginaMenuLateral = new PaginaMenuLateral(page);

    await paginaMenuLateral.irAAcercaDe();
    await expect(page).toHaveURL(/saucelabs\.com/);
  });

  test('dynamic catalog no modifica el listado de productos', async ({ page }) => {
    const paginaInventario = new PaginaInventario(page);
    const paginaMenuLateral = new PaginaMenuLateral(page);

    const nombresAntes = await paginaInventario.nombresProductos.allTextContents();
    await paginaMenuLateral.irACatalogoDinamico();
    await page.waitForTimeout(500);
    const nombresDespues = await paginaInventario.nombresProductos.allTextContents();

    expect(nombresDespues).toEqual(nombresAntes);
  });

});
