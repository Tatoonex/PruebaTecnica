import { test, expect } from '@playwright/test';
import { ClienteAutenticacion } from '../api/ClienteAutenticacion';
import { ClienteReservas } from '../api/ClienteReservas';

const datosReserva = {
  firstname: 'Brandon',
  lastname: 'Lizcano',
  totalprice: 150,
  depositpaid: true,
  bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
  additionalneeds: 'Breakfast',
};

test.describe.serial('API Restful Booker - reservas', () => {
  let token;
  let idReserva;

  test('ping responde 201', async ({ request }) => {
    const respuesta = await request.get('https://restful-booker.herokuapp.com/ping');

    expect(respuesta.status()).toBe(201);
  });

  test('autenticación con credenciales válidas devuelve token', async ({ request }) => {
    const clienteAutenticacion = new ClienteAutenticacion(request);
    const respuesta = await clienteAutenticacion.iniciarSesion('admin', 'password123');
    const cuerpo = await respuesta.json();

    expect(respuesta.ok()).toBeTruthy();
    expect(cuerpo.token).toBeTruthy();

    token = cuerpo.token;
  });

  test('autenticación con credenciales inválidas no devuelve token', async ({ request }) => {
    const clienteAutenticacion = new ClienteAutenticacion(request);
    const respuesta = await clienteAutenticacion.iniciarSesion('usuario_invalido', 'clave_invalida');
    const cuerpo = await respuesta.json();

    expect(cuerpo.token).toBeUndefined();
    expect(cuerpo.reason).toBe('Bad credentials');
  });

  test('crear una reserva devuelve bookingid y los datos enviados', async ({ request }) => {
    const clienteReservas = new ClienteReservas(request);
    const respuesta = await clienteReservas.crear(datosReserva);
    const cuerpo = await respuesta.json();

    expect(respuesta.ok()).toBeTruthy();
    expect(cuerpo.bookingid).toBeTruthy();
    expect(cuerpo.booking).toMatchObject(datosReserva);

    idReserva = cuerpo.bookingid;
  });

  test('obtener la reserva creada devuelve los mismos datos', async ({ request }) => {
    const clienteReservas = new ClienteReservas(request);
    const respuesta = await clienteReservas.obtener(idReserva);
    const cuerpo = await respuesta.json();

    expect(respuesta.ok()).toBeTruthy();
    expect(cuerpo).toMatchObject(datosReserva);
  });

  test('obtener una reserva inexistente devuelve 404', async ({ request }) => {
    const clienteReservas = new ClienteReservas(request);
    const respuesta = await clienteReservas.obtener(999999999);

    expect(respuesta.status()).toBe(404);
  });

  test('actualizar la reserva sin token es rechazado', async ({ request }) => {
    const clienteReservas = new ClienteReservas(request);
    const respuesta = await clienteReservas.actualizar(idReserva, { ...datosReserva, firstname: 'SinToken' });

    expect(respuesta.status()).toBe(403);
  });

  test('actualizar la reserva con token válido modifica los datos', async ({ request }) => {
    const clienteReservas = new ClienteReservas(request);
    const datosActualizados = { ...datosReserva, firstname: 'Actualizado', totalprice: 200 };
    const respuesta = await clienteReservas.actualizar(idReserva, datosActualizados, token);
    const cuerpo = await respuesta.json();

    expect(respuesta.ok()).toBeTruthy();
    expect(cuerpo).toMatchObject(datosActualizados);
  });

  test('actualizar parcialmente un campo con PATCH', async ({ request }) => {
    const clienteReservas = new ClienteReservas(request);
    const respuesta = await clienteReservas.actualizarParcial(idReserva, { totalprice: 999 }, token);
    const cuerpo = await respuesta.json();

    expect(respuesta.ok()).toBeTruthy();
    expect(cuerpo.totalprice).toBe(999);
    expect(cuerpo.firstname).toBe('Actualizado');
  });

  test('eliminar la reserva sin token es rechazado', async ({ request }) => {
    const clienteReservas = new ClienteReservas(request);
    const respuesta = await clienteReservas.eliminar(idReserva);

    expect(respuesta.status()).toBe(403);
  });

  test('eliminar la reserva con token válido la elimina', async ({ request }) => {
    const clienteReservas = new ClienteReservas(request);
    const respuesta = await clienteReservas.eliminar(idReserva, token);

    expect(respuesta.status()).toBe(201);
  });

  test('obtener la reserva eliminada devuelve 404', async ({ request }) => {
    const clienteReservas = new ClienteReservas(request);
    const respuesta = await clienteReservas.obtener(idReserva);

    expect(respuesta.status()).toBe(404);
  });
});
