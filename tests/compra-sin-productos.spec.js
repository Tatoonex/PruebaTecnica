import { test, expect } from '@playwright/test';
import { PaginaInicioSesion } from '../paginas/PaginaInicioSesion';
import { PaginaInventario } from '../paginas/PaginaInventario';
import { PaginaCarrito } from '../paginas/PaginaCarrito';
import { PaginaDatosCheckout } from '../paginas/PaginaDatosCheckout';
import { PaginaResumenCheckout } from '../paginas/PaginaResumenCheckout';

test('bug - permite finalizar una compra sin productos en el carrito', async ({ page }) => {
  test.fail(true, 'El sitio deja completar el checkout con el carrito vacío (Item total $0) en vez de bloquearlo o mostrar un error');

  const paginaInicioSesion = new PaginaInicioSesion(page);
  const paginaInventario = new PaginaInventario(page);
  const paginaCarrito = new PaginaCarrito(page);
  const paginaDatosCheckout = new PaginaDatosCheckout(page);
  const paginaResumenCheckout = new PaginaResumenCheckout(page);

  await paginaInicioSesion.visitar();
  await paginaInicioSesion.iniciarSesion('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory\.html/);

  await paginaInventario.irAlCarrito();
  await expect(page).toHaveURL(/cart\.html/);
  await expect(paginaCarrito.items).toHaveCount(0);

  await paginaCarrito.irACheckout();
  await paginaDatosCheckout.completarDatos('Brandon', 'Lizcano', '110110');
  await paginaResumenCheckout.finalizarCompra();

  await expect(page).not.toHaveURL(/checkout-complete\.html/);
});
