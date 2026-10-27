import { test, expect } from '@playwright/test';
import { PaginaInicioSesion } from '../paginas/PaginaInicioSesion';
import { PaginaInventario } from '../paginas/PaginaInventario';
import { PaginaCarrito } from '../paginas/PaginaCarrito';

test.describe('Exploratorios', () => {

  test('problem_user puede iniciar sesión y ver el catálogo', async ({ page }) => {
    const paginaInicioSesion = new PaginaInicioSesion(page);

    await paginaInicioSesion.visitar();
    await paginaInicioSesion.iniciarSesion('problem_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('error_user puede agregar y quitar un producto del carrito', async ({ page }) => {
    const paginaInicioSesion = new PaginaInicioSesion(page);
    const paginaInventario = new PaginaInventario(page);
    const paginaCarrito = new PaginaCarrito(page);

    await paginaInicioSesion.visitar();
    await paginaInicioSesion.iniciarSesion('error_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    await paginaInventario.agregarProducto(0);
    await paginaInventario.irAlCarrito();
    await expect(paginaCarrito.items).toHaveCount(1);

    await paginaCarrito.quitarProducto(0);
    await expect(paginaCarrito.items).toHaveCount(0);
  });

  test('visual_user puede iniciar sesión sin errores funcionales', async ({ page }) => {
    const paginaInicioSesion = new PaginaInicioSesion(page);

    await paginaInicioSesion.visitar();
    await paginaInicioSesion.iniciarSesion('visual_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('intento de inyección en el login no autentica', async ({ page }) => {
    const paginaInicioSesion = new PaginaInicioSesion(page);

    await paginaInicioSesion.visitar();
    await paginaInicioSesion.iniciarSesion("' OR '1'='1", "' OR '1'='1");

    await expect(page).toHaveURL(paginaInicioSesion.sitio);
    await expect(paginaInicioSesion.mensajeError).toBeVisible();
  });

  test('doble click en agregar al carrito agrega y quita el producto', async ({ page }) => {
    const paginaInicioSesion = new PaginaInicioSesion(page);
    const paginaInventario = new PaginaInventario(page);

    await paginaInicioSesion.visitar();
    await paginaInicioSesion.iniciarSesion('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    await paginaInventario.productos.nth(0).locator('button').dblclick();

    await expect(paginaInventario.badgeCarrito).toHaveCount(0);
    await expect(paginaInventario.productos.nth(0).locator('button')).toHaveText('Add to cart');
  });

});
