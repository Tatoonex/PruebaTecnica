import { test, expect } from '@playwright/test';
import { PaginaInicioSesion } from '../paginas/PaginaInicioSesion';

test.describe('No funcionales', () => {

  test('rendimiento - performance_glitch_user tarda notablemente más que standard_user', async ({ page }) => {
    const paginaInicioSesion = new PaginaInicioSesion(page);

    await paginaInicioSesion.visitar();
    const inicioEstandar = Date.now();
    await paginaInicioSesion.iniciarSesion('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
    const duracionEstandar = Date.now() - inicioEstandar;

    await page.context().clearCookies();
    await paginaInicioSesion.visitar();
    const inicioGlitch = Date.now();
    await paginaInicioSesion.iniciarSesion('performance_glitch_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
    const duracionGlitch = Date.now() - inicioGlitch;

    expect(duracionGlitch).toBeGreaterThan(duracionEstandar * 2);
  });

  test('seguridad - el sitio se sirve sobre HTTPS', async ({ page }) => {
    const paginaInicioSesion = new PaginaInicioSesion(page);

    await paginaInicioSesion.visitar();

    expect(page.url()).toMatch(/^https:\/\//);
  });

  test('seguridad - el campo de contraseña oculta el valor', async ({ page }) => {
    const paginaInicioSesion = new PaginaInicioSesion(page);

    await paginaInicioSesion.visitar();

    await expect(paginaInicioSesion.campoContrasena).toHaveAttribute('type', 'password');
  });

  test('accesibilidad - las imágenes de producto tienen texto alternativo', async ({ page }) => {
    const paginaInicioSesion = new PaginaInicioSesion(page);

    await paginaInicioSesion.visitar();
    await paginaInicioSesion.iniciarSesion('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    const imagenes = page.locator('.inventory_item_img img');
    const cantidad = await imagenes.count();
    for (let i = 0; i < cantidad; i++) {
      await expect(imagenes.nth(i)).toHaveAttribute('alt', /.+/);
    }
  });

  test.describe('responsividad', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('el flujo de login es usable en un viewport móvil', async ({ page }) => {
      const paginaInicioSesion = new PaginaInicioSesion(page);

      await paginaInicioSesion.visitar();
      await paginaInicioSesion.iniciarSesion('standard_user', 'secret_sauce');

      await expect(page).toHaveURL(/inventory\.html/);
    });
  });

});
