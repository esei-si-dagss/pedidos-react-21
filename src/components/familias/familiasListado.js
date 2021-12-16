
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';

import { useNavigate } from 'react-router-dom';

import familiasService from '../../services/familiasService';

export default function ClientesListado(props) {

    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [familias, setFamilias] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [familiaActual, setFamiliaActual] = useState(null);
    const [dialogoBorrado, setDialogoBorrado] = useState(false);

    let navigate = useNavigate();


    useEffect(() => {
        familiasService.buscarTodas().then(res => {
            setFamilias(res.data);
            setCargando(false);
        });
    }, [dialogoBorrado]); // vincula la recarga a cambios en dialogoBorrado (para forzar la recarga despues de un borrado)


    function nuevaFamilia() {
        navigate("nuevo"); // navega a URL para creacion de nuevo cliente
    }

    function editarFamilia(familia) {
        let a = typeof familia.id;
        console.log(a);
        console.log("navega a "+familia.id);
        console.log(familia);
        navigate(familia.id.toString()); // navega a URL de la familia
    }

    function confirmarBorradoFamilia(familia) {
        setFamiliaActual(familia);
        setDialogoBorrado(true);
    }

    function borrarFamilia() {
        familiasService.eliminar(familiaActual.id);
        ocultarDialogoBorrado();
    }

    function ocultarDialogoBorrado() {
        setFamiliaActual(null);
        setDialogoBorrado(false);
    }

    function buscarPorDescripcion() {
        setCargando(true);
        familiasService.buscarPorDescripcion(textoBusqueda).then(res => {
            setFamilias(res.data);
            setCargando(false);
        });
    }

    function buscarTodos() {
        setCargando(true);
        familiasService.buscarTodas().then(res => {
            setFamilias(res.data);
            setCargando(false);
        });
    }

    function onBusquedaChange(e) {
        setTextoBusqueda(e.target.value);
    }

    function accionesFamilia(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editarFamilia(rowData)} tooltip="Ver/editar la familia" />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmarBorradoFamilia(rowData)} tooltip="Eliminar la familia" />
            </React.Fragment>
        );
    }


    const pieDialogoBorrado = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={ocultarDialogoBorrado}  />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={borrarFamilia} />
        </React.Fragment>
    );
    return (
        <div>
            <div className="text-3xl text-800 font-bold mb-4">Listado de familias</div>

            <div className="grid">
                <InputText id="busqueda" className="col-6 mr-2" onChange={onBusquedaChange} />
                <Button label="Buscar por descripción" className="col-1 mr-2" onClick={buscarPorDescripcion} />
                <Button label="Buscar todas" className="col-1 mr-2" onClick={buscarTodos} />
            </div>

            <div className="flex justify-content-end">
                <Button label="Nueva familia" icon="pi pi-plus" className="p-button-lg" onClick={nuevaFamilia} tooltip="Crear una nueva familia" tooltipOptions={{position: 'bottom'}} />
            </div>

            {cargando && <div> <ProgressSpinner /> Cargando... </div>}

            <div className="surface-card p-4 border-round shadow-2">
                <DataTable value={familias} responsiveLayout="scroll" stripedRows emptyMessage="No hay familias que mostrar">
                    <Column field="id" header="ID" />
                    <Column field="nombre" header="Nombre" sortable />
                    <Column field="descripcion" header="Descripcion"/>
                    <Column body={accionesFamilia} />
                </DataTable>
            </div>

            <Dialog visible={dialogoBorrado} style={{ width: '450px' }} header="Confirm" modal
                footer={pieDialogoBorrado} onHide={ocultarDialogoBorrado}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {familiaActual && <span>Confirmar el borrado de <b>{familiaActual.nombre}</b>?</span>}
                </div>
            </Dialog>

        </div>
    );
}