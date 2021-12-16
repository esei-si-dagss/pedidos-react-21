import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { InputNumber } from 'primereact/inputnumber';

import { useParams } from "react-router-dom";

import almacenesService from '../../services/almacenesService';
import articulosService from '../../services/articulosService';


export default function AlmacenesStock() {
    const params = useParams();
    const idAlmacen = params.idAlmacen;

    const [cargando, setCargando] = useState(true);
    const [almacenActual, setAlmacenActual] = useState(null);
    const [articulosAlmacen, setArticulosAlmacen] = useState([]);
    const [articuloAlmacenActual, setArticuloAlmacenActual] = useState(null);

    const [articulos, setArticulos] = useState([]);
    const [articuloBusqueda, setArticuloBusqueda] = useState(null);
    const [stock, setStock] = useState(0);

    const [esNuevo, setEsNuevo] = useState(false);
    const [dialogoBorrado, setDialogoBorrado] = useState(false);


    useEffect(() => {
        recargarArticulosAlmacen();
        almacenesService.buscarPorId(idAlmacen).then(res => setAlmacenActual(res.data));
        articulosService.buscarTodos().then(res => setArticulos(res.data));
    }, []);  // al no estar vinculado a cambios, solo se ejecuta en el primer renderizado


    function recargarArticulosAlmacen() {
        setCargando(true);
        almacenesService.buscarArticulosAlmacen(idAlmacen).then(res => {
            setArticulosAlmacen(res.data);
            setCargando(false);
        });
    }

    function confirmarBorradoArticuloAlmacen(articuloAlmacen) {
        setArticuloAlmacenActual(articuloAlmacen);
        setDialogoBorrado(true);
    }

    function borrarArticuloAlmacen() {
        almacenesService.eliminarArticuloAlmacen(almacenActual.id, articuloAlmacenActual.articulo.id).then(res => {
            ocultarDialogoBorrado();
            recargarArticulosAlmacen();
        });
    }

    function ocultarDialogoBorrado() {
        setArticuloAlmacenActual(null);
        setDialogoBorrado(false);
    }

    function nuevoArticuloAlmacen() {
        setArticuloAlmacenActual({ articulo: {}, almacen: almacenActual, stock: 0 });
        setStock(0);
        setEsNuevo(true);
    }


    function editarArticuloAlmacen(articuloAlmacen) {
        setArticuloAlmacenActual(articuloAlmacen);
        setStock(articuloAlmacen.stock);
        setEsNuevo(false);
    }


    function onArticuloBusquedaChange(e) {
        const articulo = e.target.value;
        articuloAlmacenActual.articulo = articulo;
        setArticuloBusqueda(articulo);
    }

    function onGuardarArticuloAlmacen(e) {
        articuloAlmacenActual.stock = stock;
        if (esNuevo) {
            almacenesService.anadirArticuloAlmacen(almacenActual.id, articuloAlmacenActual).then(res => {
                setEsNuevo(false);
                setArticuloAlmacenActual(null);
                recargarArticulosAlmacen();
            });
        } else {
            almacenesService.modificarArticuloAlmacen(almacenActual.id, articuloAlmacenActual.articulo.id, articuloAlmacenActual).then(res => {
                setArticuloAlmacenActual(null);
                recargarArticulosAlmacen();
            });
        }
    }

    function onCancelarArticuloAlmacen(e) {
        setArticuloAlmacenActual(null);
        setEsNuevo(false);
    }

    function accionesArticuloAlmacen(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editarArticuloAlmacen(rowData)} tooltip="Editar stock del artículo" />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmarBorradoArticuloAlmacen(rowData)} tooltip="Eliminar el artículo" />
            </React.Fragment>
        );
    }

    const pieDialogoBorrado = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={ocultarDialogoBorrado} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={borrarArticuloAlmacen} />
        </React.Fragment>
    );

    function panelEdicion() {
        return (
            <div>
                <Divider />

                <Panel header={esNuevo ? "Añadir artículo" : "Actualizar stock artículo"}>
                    <div className="grid">
                        <div className="col-4">
                            <label className="mr-2">Artículo</label>
                            {esNuevo ? <Dropdown value={articuloBusqueda} options={articulos} onChange={onArticuloBusquedaChange} optionLabel="nombre" filter showClear filterBy="nombre" placeholder="Seleccionar artículo" className="col-8 mr-2 mt-2" />
                                : <InputText value={articuloAlmacenActual.articulo.nombre} readOnly className="mr-2" />}
                        </div>
                        <div className="col-3">
                            <label htmlFor="stock" className="mr-2">Stock</label>
                            <InputNumber id="stock" value={stock} onValueChange={(e) => setStock(e.value)} showButtons buttonLayout="horizontal" className="mr-2" />
                        </div>
                        <div className="col-3">
                            <Button label={esNuevo ? "Añadir" : "Modificar"} onClick={onGuardarArticuloAlmacen} icon="pi pi-check mr-2" />
                            <Button label="Cancelar" onClick={onCancelarArticuloAlmacen} icon="pi pi-times" className="p-button-outlined mr-2" />
                        </div>
                    </div>
                </Panel>
            </div>
        );
    }

    return (
        <div>

            <div className="flex justify-content-end">
                <Button label="Añadir artículo" icon="pi pi-plus" className="p-button-lg" onClick={nuevoArticuloAlmacen} tooltip="Añadir un artículo" tooltipOptions={{ position: 'bottom' }} />
            </div>

            {cargando && <div> <ProgressSpinner /> Cargando... </div>}

            <div className="surface-card p-4 border-round shadow-2">
                <DataTable value={articulosAlmacen} responsiveLayout="scroll" stripedRows emptyMessage="No hay articulos que mostrar">
                    <Column field="articulo.nombre" header="Articulo" />
                    <Column field="articulo.familia.nombre" header="Familia" sortable />
                    <Column field="stock" header="Stock" />
                    <Column body={accionesArticuloAlmacen} />
                </DataTable>
            </div>
            {(articuloAlmacenActual && !dialogoBorrado) && panelEdicion()}

            <Dialog visible={dialogoBorrado} style={{ width: '450px' }} header="Confirm" modal
                footer={pieDialogoBorrado} onHide={ocultarDialogoBorrado}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {articuloAlmacenActual && <span>Confirmar el borrado de <b>{articuloAlmacenActual.articulo.nombre}</b>?</span>}
                </div>
            </Dialog>

        </div>
    );
}