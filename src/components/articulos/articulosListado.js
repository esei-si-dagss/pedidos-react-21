
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';




import { useNavigate } from 'react-router-dom';

import articulosService from '../../services/articulosService';
import familiasService from '../../services/familiasService';

export default function ArticulosListado(props) {

    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [familias, setFamilias] = useState([]);
    const [familiaBusqueda, setFamiliaBusqueda] = useState(null);
    const [articulos, setArticulos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [articuloActual, setArticuloActual] = useState(null);
    const [dialogoBorrado, setDialogoBorrado] = useState(false);

    let navigate = useNavigate();


    useEffect(() => {
        articulosService.buscarTodos().then(res => {
            setArticulos(res.data);
            setCargando(false);
        });
    }, [dialogoBorrado]); // vincula la recarga a cambios en dialogoBorrado (para forzar la recarga despues de un borrado)


    useEffect(() => {
        familiasService.buscarTodas().then(res => setFamilias(res.data));
    }, []);  // al no estar vinculado a cambios, solo se ejecuta en el primer renderizado


    function nuevoArticulo() {
        navigate("nuevo"); // navega a URL para creacion de nuevo articulo
    }

    function editarArticulo(articulo) {
        navigate(articulo.id.toString()); // navega a URL del articulo
    }

    function confirmarBorradoArticulo(articulo) {
        setArticuloActual(articulo);
        setDialogoBorrado(true);
    }

    function borrarArticulo() {
        articulosService.eliminar(articuloActual.id);
        ocultarDialogoBorrado();
    }

    function ocultarDialogoBorrado() {
        setArticuloActual(null);
        setDialogoBorrado(false);
    }

    function buscarPorDescripcion() {
        setCargando(true);
        articulosService.buscarPorDescripcion(textoBusqueda).then(res => {
            setArticulos(res.data);
            setCargando(false);
        });
    }

    function buscarPorFamilia() {
        if (familiaBusqueda != null) {
            setCargando(true);
            articulosService.buscarPorFamiliaId(familiaBusqueda.id).then(res => {
                setArticulos(res.data);
                setCargando(false);
            });
        }
    }

    function buscarTodos() {
        setCargando(true);
        articulosService.buscarTodos().then(res => {
            setArticulos(res.data);
            setCargando(false);
        });
    }

    function onBusquedaChange(e) {
        setTextoBusqueda(e.target.value);
    }

    function onFamiliaBusquedaChange(e) {
        setFamiliaBusqueda(e.target.value);
    }

    function accionesArticulo(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editarArticulo(rowData)} tooltip="Ver/editar el artículo" />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmarBorradoArticulo(rowData)} tooltip="Eliminar el artículo" />
            </React.Fragment>
        );
    }


    function formatoImporte(rowData) {
        return rowData.precioUnitario.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
    }


    const pieDialogoBorrado = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={ocultarDialogoBorrado} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={borrarArticulo}  />
        </React.Fragment>
    );
    return (
        <div>
            <div className="text-3xl text-800 font-bold mb-4">Listado de artículos</div>

            <div className="grid">
                <div className="col-8">
                    <div className="row">
                        <InputText id="busqueda" className="col-8 mr-2" onChange={onBusquedaChange} />
                        <Button label="Buscar por descripción" className="col-3 mt-2 mr-2"  onClick={buscarPorDescripcion}/>
                    </div>
                    <div className="row">
                        <Dropdown value={familiaBusqueda} options={familias} onChange={onFamiliaBusquedaChange} optionLabel="nombre"
                            filter showClear filterBy="nombre" placeholder="Seleccionar familia" className="col-8 mr-2 mt-2" />
                        <Button label="Buscar por familia" className="col-3 mt-2 mr-2"  onClick={buscarPorFamilia}/>
                    </div>
                </div>
                <Button label="Buscar todos" className="col-2 my-2 mr-2"  onClick={buscarTodos} />
            </div>

            <div className="flex justify-content-end">
                <Button label="Nuevo artículo" icon="pi pi-plus" className="p-button-lg" onClick={nuevoArticulo} tooltip="Crear un nuevo artículo" tooltipOptions={{ position: 'bottom' }} />
            </div>

            {cargando && <div> <ProgressSpinner /> Cargando... </div>}

            <div className="surface-card p-4 border-round shadow-2">
                <DataTable value={articulos} responsiveLayout="scroll" stripedRows emptyMessage="No hay artículos que mostrar">
                    <Column field="id" header="ID" />
                    <Column field="nombre" header="Nombre" sortable />
                    <Column field="descripcion" header="Descripción" />
                    <Column field="familia.nombre" header="Familia" sortable />
                    <Column body={formatoImporte} header="Precio unitario" />
                    <Column body={accionesArticulo} />
                </DataTable>
            </div>

            <Dialog visible={dialogoBorrado} style={{ width: '450px' }} header="Confirm" modal
                footer={pieDialogoBorrado} onHide={ocultarDialogoBorrado}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {articuloActual && <span>Confirmar el borrado de <b>{articuloActual.nombre}</b>?</span>}
                </div>
            </Dialog>

        </div>
    );
}