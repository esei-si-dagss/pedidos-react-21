import React, { useState, useEffect } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';

import { useParams, useNavigate } from "react-router-dom";

import familiasService from '../../services/familiasService';

export default function FamiliasDetalle() {

    const params = useParams();
    const navigate = useNavigate();
    const esNuevo = !('idFamilia' in params);

    const familiaVacia = { nombre: "", descripcion: "" };
    const [familia, setFamilia] = useState(familiaVacia);
    const [submitted, setSubmitted] = useState(false);


    useEffect(() => {
        if (!esNuevo) {
            familiasService.buscarPorId(params.idFamilia).then(res => setFamilia(res.data));
        }
    }, []);


    function onInputChange(e, name) {
        const val = (e.target && e.target.value) || '';
        let _familia = { ...familia };
        _familia[`${name}`] = val;
        setFamilia(_familia);
    }

    function onCancelar(event) {
        navigate("/familias");
    }

    function handleSubmit(event) {
        event.preventDefault();
        setSubmitted(true);
        if (esNuevo) {
            familiasService.crear(familia);
        } else {
            familiasService.modificar(familia.id, familia);
        }
        navigate("/familias");
    }

    return (
        <div>
            <div className="surface-card border-round shadow-2 p-4">
                {!esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Detalle de la familia</span>}
                {esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Nueva familia</span>}

                <form onSubmit={handleSubmit} >
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="id" >ID</label>
                            <InputText id="id" value={familia.id} readOnly disabled/>
                        </div>

                        <div className="p-field">
                            <label htmlFor="name">Nombre</label>
                            <InputText id="name" value={familia.nombre} onChange={(e) => onInputChange(e, 'nombre')} required className={classNames({ 'p-invalid': submitted && !familia.nombre })} />
                            {submitted && !familia.nombre && <small className="p-error">Debe indicarse un nombre.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="descripcion">Descripcion</label>
                            <InputText id="descripcion" value={familia.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} />
                        </div>
                    </div>

                    <Divider />

                    <div className="p-p-3">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined mr-2" onClick={onCancelar} />
                        <Button label="Guardar" icon="pi pi-check" type="submit" />
                    </div>
                </form>
            </div>
        </div>
    );
}
