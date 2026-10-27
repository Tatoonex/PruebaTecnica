export class ClienteReservas {
  constructor(request) {
    this.request = request;
    this.urlBase = 'https://restful-booker.herokuapp.com';
  }

  async crear(datos) {
    return this.request.post(`${this.urlBase}/booking`, { data: datos });
  }

  async obtener(id) {
    return this.request.get(`${this.urlBase}/booking/${id}`);
  }

  async listar(filtros = {}) {
    return this.request.get(`${this.urlBase}/booking`, { params: filtros });
  }

  async actualizar(id, datos, token) {
    return this.request.put(`${this.urlBase}/booking/${id}`, {
      data: datos,
      headers: token ? { Cookie: `token=${token}` } : undefined,
    });
  }

  async actualizarParcial(id, cambios, token) {
    return this.request.patch(`${this.urlBase}/booking/${id}`, {
      data: cambios,
      headers: token ? { Cookie: `token=${token}` } : undefined,
    });
  }

  async eliminar(id, token) {
    return this.request.delete(`${this.urlBase}/booking/${id}`, {
      headers: token ? { Cookie: `token=${token}` } : undefined,
    });
  }
}
