export class ClienteAutenticacion {
  constructor(request) {
    this.request = request;
    this.urlBase = 'https://restful-booker.herokuapp.com';
  }

  async iniciarSesion(usuario, contrasena) {
    return this.request.post(`${this.urlBase}/auth`, {
      data: { username: usuario, password: contrasena },
    });
  }
}
