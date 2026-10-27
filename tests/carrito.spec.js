import { test, expect } from '@playwright/test';
import { PaginaInicioSesion } from '../paginas/PaginaInicioSesion';
import { PaginaInventario } from '../paginas/PaginaInventario';
import { PaginaCarrito } from '../paginas/PaginaCarrito';
import { PaginaDetalleProducto } from '../paginas/PaginaDetalleProducto';

test.describe('Carrito y catálogo', () => {

  test.beforeEach(async ({ page }) => {
    const paginaInicioSesion = new PaginaInicioSesion(page);
    await paginaInicioSesion.visitar();
    await paginaInicioSesion.iniciarSesion('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('agregar un producto actualiza el botón y el contador', async ({ page }) => {
    const paginaInventario = new PaginaInventario(page);

    await paginaInventario.agregarProducto(0);

    await expect(paginaInventario.productos.nth(0).locator('button')).toHaveText('Remove');
    await expect(paginaInventario.badgeCarrito).toHaveText('1');
  });

  test('quitar un producto del carrito', async ({ page }) => {
    const paginaInventario = new PaginaInventario(page);
    const paginaCarrito = new PaginaCarrito(page);

    await paginaInventario.agregarProducto(0);
    await paginaInventario.irAlCarrito();
    await expect(paginaCarrito.items).toHaveCount(1);

    await paginaCarrito.quitarProducto(0);
    await expect(paginaCarrito.items).toHaveCount(0);
  });

  test('ordenar productos por precio de menor a mayor', async ({ page }) => {
    const paginaInventario = new PaginaInventario(page);

    await paginaInventario.ordenarPor('lohi');
    const precios = await paginaInventario.precios.allTextContents();
    const valores = precios.map((p) => parseFloat(p.replace('$', '')));
    const ordenados = [...valores].sort((a, b) => a - b);

    expect(valores).toEqual(ordenados);
  });

  test('ordenar productos por nombre de A a Z', async ({ page }) => {
    const paginaInventario = new PaginaInventario(page);

    await paginaInventario.ordenarPor('az');
    const nombres = await paginaInventario.nombresProductos.allTextContents();
    const ordenados = [...nombres].sort((a, b) => a.localeCompare(b));

    expect(nombres).toEqual(ordenados);
  });

  test('ver detalle de un producto', async ({ page }) => {
    const paginaInventario = new PaginaInventario(page);
    const paginaDetalleProducto = new PaginaDetalleProducto(page);

    const nombreEnListado = await paginaInventario.nombresProductos.first().textContent();
    await paginaInventario.abrirDetalle(0);

    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(paginaDetalleProducto.nombre).toHaveText(nombreEnListado);

    await paginaDetalleProducto.volver();
    await expect(page).toHaveURL(/inventory\.html/);
  });

});
