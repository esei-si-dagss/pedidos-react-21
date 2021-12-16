import clienteREST from "./clienteREST";

class AlmacenesService {
  buscarTodos() {
    return clienteREST.get("/almacenes");
  }

  buscarPorId(id) {
    return clienteREST.get(`/almacenes/${id}`);
  }

  crear(data) {
    return clienteREST.post("/almacenes", data);
  }

  modificar(id, data) {
    return clienteREST.put(`/almacenes/${id}`, data);
  }

  eliminar(id) {
    return clienteREST.delete(`/almacenes/${id}`);
  }

  buscarPorLocalidad(localidad) {
    return clienteREST.get(`/almacenes?localidad=${localidad}`);
  }

  buscarArticulosAlmacen(id) {
    return clienteREST.get(`/almacenes/${id}/articulos`);
  }

  anadirArticuloAlmacen(idAlmacen, nuevoArticuloAlmacen) {
    return clienteREST.post(`/almacenes/${idAlmacen}/articulos`, nuevoArticuloAlmacen);
  }

  modificarArticuloAlmacen(idAlmacen, idArticulo, nuevoArticuloAlmacen) {
    return clienteREST.put(`/almacenes/${idAlmacen}/articulos/${idArticulo}`, nuevoArticuloAlmacen);
  }

  eliminarArticuloAlmacen(idAlmacen, idArticulo) {
    return clienteREST.delete(`/almacenes/${idAlmacen}/articulos/${idArticulo}`);
  }
}

export default new AlmacenesService();