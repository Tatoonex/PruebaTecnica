import { test, expect } from '@playwright/test';
import { PaginaInicioSesion } from '../paginas/PaginaInicioSesion';
import { PaginaInventario } from '../paginas/PaginaInventario';
import { PaginaCarrito } from '../paginas/PaginaCarrito';
import { PaginaDatosCheckout } from '../paginas/PaginaDatosCheckout';

test.describe('Checkout', () => {

  test.beforeEach(async ({ page }) => {
    const paginaInicioSesion = new PaginaInicioSesion(page);
    const paginaInventario = new PaginaInventario(page);
    const paginaCarrito = new PaginaCarrito(page);

    await paginaInicioSesion.visitar();
    await paginaInicioSesion.iniciarSesion('standard_user', 'secret_sauce');
    await paginaInventario.agregarProductosAlCarrito(1);
    await paginaInventario.irAlCarrito();
    await paginaCarrito.irACheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('checkout con datos vacíos muestra error de validación', async ({ page }) => {
    const paginaDatosCheckout = new PaginaDatosCheckout(page);

    await paginaDatosCheckout.botonContinuar.click();

    await expect(paginaDatosCheckout.mensajeError).toContainText('First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('cancelar en checkout regresa al carrito sin perder los productos', async ({ page }) => {
    const paginaDatosCheckout = new PaginaDatosCheckout(page);
    const paginaCarrito = new PaginaCarrito(page);

    await paginaDatosCheckout.botonCancelar.click();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(paginaCarrito.items).toHaveCount(1);
  });

});
