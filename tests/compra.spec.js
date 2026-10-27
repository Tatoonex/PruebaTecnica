import { test, expect } from '@playwright/test';
import fs from 'fs';
import { PaginaInicioSesion } from '../paginas/PaginaInicioSesion';
import { PaginaInventario } from '../paginas/PaginaInventario';
import { PaginaCarrito } from '../paginas/PaginaCarrito';
import { PaginaDatosCheckout } from '../paginas/PaginaDatosCheckout';
import { PaginaResumenCheckout } from '../paginas/PaginaResumenCheckout';
import { PaginaConfirmacionCompra } from '../paginas/PaginaConfirmacionCompra';

test('compra happy path - tres productos', async ({ page }) => {
  const paginaInicioSesion = new PaginaInicioSesion(page);
  const paginaInventario = new PaginaInventario(page);
  const paginaCarrito = new PaginaCarrito(page);
  const paginaDatosCheckout = new PaginaDatosCheckout(page);
  const paginaResumenCheckout = new PaginaResumenCheckout(page);
  const paginaConfirmacionCompra = new PaginaConfirmacionCompra(page);

  await paginaInicioSesion.visitar();
  await paginaInicioSesion.iniciarSesion('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory\.html/);

  await paginaInventario.agregarProductosAlCarrito(3);
  await paginaInventario.irAlCarrito();
  await expect(page).toHaveURL(/cart\.html/);
  await expect(paginaCarrito.items).toHaveCount(3);

  await paginaCarrito.irACheckout();
  await expect(page).toHaveURL(/checkout-step-one\.html/);

  await paginaDatosCheckout.completarDatos('Brandon', 'Lizcano', '110110');
  await expect(page).toHaveURL(/checkout-step-two\.html/);

  await paginaResumenCheckout.finalizarCompra();
  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(paginaConfirmacionCompra.encabezado).toHaveText('Thank you for your order!');

  const rutaPdf = await paginaConfirmacionCompra.descargarComprobantePdf();
  expect(fs.existsSync(rutaPdf)).toBe(true);
});
