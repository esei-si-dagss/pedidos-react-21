import clienteREST from "./clienteREST";

class ArticulosService {
  buscarTodos() {
    return clienteREST.get("/articulos");
  }

  buscarPorId(id) {
    return clienteREST.get(`/articulos/${id}`);
  }

  crear(data) {
    return clienteREST.post("/articulos", data);
  }

  modificar(id, data) {
    return clienteREST.put(`/articulos/${id}`, data);
  }

  eliminar(id) {
    return clienteREST.delete(`/articulos/${id}`);
  }

  buscarPorDescripcion(descripcion) {
    return clienteREST.get(`/articulos?descripcion=${descripcion}`);
  }

  buscarPorFamiliaId(familiaId) {
    return clienteREST.get(`/articulos?familiaId=${familiaId}`);
  }
}

export default new ArticulosService();