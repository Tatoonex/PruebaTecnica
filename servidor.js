const http = require('http');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const PUERTO = 3456;
const RAIZ = __dirname;

function recolectarPruebas(conjunto, salida) {
  for (const especificacion of conjunto.specs || []) {
    for (const prueba of especificacion.tests || []) {
      const resultado = prueba.results && prueba.results[0];
      salida.push({
        titulo: especificacion.title,
        estado: resultado ? resultado.status : 'unknown',
        duracion: resultado ? resultado.duration : 0,
        error: resultado && resultado.error ? resultado.error.message : null,
      });
    }
  }
  for (const hijo of conjunto.suites || []) {
    recolectarPruebas(hijo, salida);
  }
}

const servidor = http.createServer((peticion, respuesta) => {
  if (peticion.method === 'GET' && peticion.url === '/') {
    const html = fs.readFileSync(path.join(RAIZ, 'panel.html'));
    respuesta.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    respuesta.end(html);
    return;
  }

  if (peticion.method === 'POST' && peticion.url === '/api/ejecutar') {
    const comando = 'npx playwright test tests/inicio-sesion.spec.js --project=chromium --reporter=json';
    exec(comando, { cwd: RAIZ, maxBuffer: 1024 * 1024 * 20 }, (error, salidaEstandar, errorEstandar) => {
      let reporte;
      try {
        reporte = JSON.parse(salidaEstandar);
      } catch (e) {
        respuesta.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        respuesta.end(JSON.stringify({ exito: false, error: 'No se pudo interpretar el resultado de Playwright', crudo: salidaEstandar || errorEstandar }));
        return;
      }

      const pruebas = [];
      for (const conjunto of reporte.suites || []) {
        recolectarPruebas(conjunto, pruebas);
      }

      respuesta.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      respuesta.end(JSON.stringify({ exito: true, estadisticas: reporte.stats, pruebas }));
    });
    return;
  }

  respuesta.writeHead(404, { 'Content-Type': 'text/plain' });
  respuesta.end('No encontrado');
});

servidor.listen(PUERTO, () => {
  console.log(`Panel de regresión disponible en http://localhost:${PUERTO}`);
});
