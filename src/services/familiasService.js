import clienteREST from "./clienteREST";

class FamiliasService {
  buscarTodas() {
    return clienteREST.get("/familias");
  }

  buscarPorId(id) {
    return clienteREST.get(`/familias/${id}`);
  }

  crear(data) {
    return clienteREST.post("/familias", data);
  }

  modificar(id, data) {
    return clienteREST.put(`/familias/${id}`, data);
  }

  eliminar(id) {
    return clienteREST.delete(`/familias/${id}`);
  }

  buscarPorDescripcion(descripcion) {
    return clienteREST.get(`/familias?descripcion=${descripcion}`);
  }
}

export default new FamiliasService();