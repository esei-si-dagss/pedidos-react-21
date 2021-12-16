import clienteREST from "./clienteREST";

class PedidosService {
  buscarTodos() {
    return clienteREST.get("/pedidos");
  }

  buscarPorId(id) {
    return clienteREST.get(`/pedidos/${id}`);
  }

  crear(data) {
    return clienteREST.post("/pedidos", data);
  }

  modificar(id, data) {
    return clienteREST.put(`/pedidos/${id}`, data);
  }

  eliminar(id) {
    return clienteREST.delete(`/pedidos/${id}`);
  }

  buscarPorClienteDNI(dni) {
    return clienteREST.get(`/pedidos?clienteDni=${dni}`);
  }
}

export default new PedidosService();