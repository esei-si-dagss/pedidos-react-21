
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';


import { useNavigate } from 'react-router-dom';

import almacenesService from '../../services/almacenesService';
import articulosService from '../../services/articulosService';

export default function AlmacenesListado(props) {

    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [articulos, setArticulos] = useState([]);
    const [articuloBusqueda, setArticuloBusqueda] = useState(null);
    const [almacenes, setAlmacenes] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [almacenActual, setAlmacenActual] = useState(null);
    const [dialogoBorrado, setDialogoBorrado] = useState(false);

    let navigate = useNavigate();


    useEffect(() => {
        almacenesService.buscarTodos().then(res => {
            setAlmacenes(res.data);
            setCargando(false);
        });
    }, [dialogoBorrado]); // vincula la recarga a cambios en dialogoBorrado (para forzar la recarga despues de un borrado)


    useEffect(() => {
        articulosService.buscarTodos().then(res => setArticulos(res.data));
    }, []);  // al no estar vinculado a cambios, solo se ejecuta en el primer renderizado


    function nuevoAlmacen() {
        navigate("nuevo"); // navega a URL para creacion de nuevo articulo
    }

    function editarAlmacen(almacen) {
        navigate(almacen.id.toString()); // navega a URL del articulo
    }

    function confirmarBorradoAlmacen(almacen) {
        setAlmacenActual(almacen);
        setDialogoBorrado(true);
    }

    function borrarAlmacen() {
        almacenesService.eliminar(almacenActual.id);
        ocultarDialogoBorrado();
    }

    function ocultarDialogoBorrado() {
        setAlmacenActual(null);
        setDialogoBorrado(false);
    }

    function buscarPorLocalidad() {
        setCargando(true);
        almacenesService.buscarPorLocalidad(textoBusqueda).then(res => {
            setAlmacenes(res.data);
            setCargando(false);
        });
    }

    function buscarPorArticulo() {
        if (articuloBusqueda != null) {
            setCargando(true);
            almacenesService.buscarPorProductoId(articuloBusqueda.id).then(res => {
                setAlmacenes(res.data);
                setCargando(false);
            });
        }
    }

    function buscarTodos() {
        setCargando(true);
        almacenesService.buscarTodos().then(res => {
            setAlmacenes(res.data);
            setCargando(false);
        });
    }

    function onBusquedaChange(e) {
        setTextoBusqueda(e.target.value);
    }

    function onArticuloBusquedaChange(e) {
        setArticuloBusqueda(e.target.value);
    }

    function accionesAlmacen(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editarAlmacen(rowData)} tooltip="Ver/editar el almacén"/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmarBorradoAlmacen(rowData)} tooltip="Eliminar el almacén" />
            </React.Fragment>
        );
    }


    const pieDialogoBorrado = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={ocultarDialogoBorrado} />
            <Button label="si" icon="pi pi-check" className="p-button-text" onClick={borrarAlmacen} />
        </React.Fragment>
    );

    return (
        <div>
            <div className="text-3xl text-800 font-bold mb-4">Listado de almacenes</div>

            <div className="grid">
                <div className="col-8">
                    <div className="row">
                        <InputText id="busqueda" className="col-8 mr-2" onChange={onBusquedaChange} />
                        <Button label="Buscar por localidad" className="col-3 mt-2 mr-2" onClick={buscarPorLocalidad} />
                    </div>
                    <div className="row">
                        <Dropdown value={articuloBusqueda} options={articulos} onChange={onArticuloBusquedaChange} optionLabel="nombre"
                            filter showClear filterBy="nombre" placeholder="Seleccionar artículo" className="col-8 mr-2 mt-2" />
                        <Button label="Buscar por artículo" className="col-3 mt-2 mr-2" onClick={buscarPorArticulo} />
                    </div>
                </div>
                <Button label="Buscar todos" className="col-2 my-2 mr-2" onClick={buscarTodos} />
            </div>

            <div className="flex justify-content-end">
                <Button label="Nuevo almacén" icon="pi pi-plus" className="p-button-lg" onClick={nuevoAlmacen} tooltip="Crear un nuevo almacén" tooltipOptions={{ position: 'bottom' }} />
            </div>

            {cargando && <div> <ProgressSpinner /> Cargando... </div>}

            <div className="surface-card p-4 border-round shadow-2">
                <DataTable value={almacenes} responsiveLayout="scroll" stripedRows emptyMessage="No hay almacenes que mostrar">
                    <Column field="id" header="ID" />
                    <Column field="nombre" header="Nombre" sortable />
                    <Column field="descripcion" header="Descripción" />
                    <Column field="direccion.localidad" header="Localidad" sortable />
                    <Column field="direccion.codigoPostal" header="Código Postal" />
                    <Column field="direccion.provincia" header="Provincia" sortable />
                    <Column field="direccion.telefono" header="Teléfono" />
                    <Column body={accionesAlmacen} />
                </DataTable>
            </div>

            <Dialog visible={dialogoBorrado} style={{ width: '450px' }} header="Confirm" modal
                footer={pieDialogoBorrado} onHide={ocultarDialogoBorrado}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {almacenActual && <span>Confirmar el borrado de <b>{almacenActual.nombre}</b>?</span>}
                </div>
            </Dialog>

        </div>
    );
}