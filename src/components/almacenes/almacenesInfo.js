import React, { useState, useEffect } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';

import { useParams, useNavigate } from "react-router-dom";

import almacenesService from '../../services/almacenesService';

export default function AlmacenesInfo() {

    const params = useParams();
    const navigate = useNavigate();
    const esNuevo = !('idAlmacen' in params);

    const almacenVacio = { id: null, nombre: "", descripcion: "", direccion: { domicilio: "", localidad: "", codigoPostal: "", provincia: "", telefono: "" }};
    const [almacen, setAlmacen] = useState(almacenVacio);
    const [submitted, setSubmitted] = useState(false);


    useEffect(() => {
        if (!esNuevo) {
            almacenesService.buscarPorId(params.idAlmacen).then(res => setAlmacen(res.data));
        }
    }, []);


    function onInputChange(e, name) {
        const val = (e.target && e.target.value) || '';
        let _almacen = { ...almacen };
        if (name.startsWith('direccion')) {
            const campoDireccion = name.split('.')[1];
            _almacen.direccion[`${campoDireccion}`] = val;

        } else {
            _almacen[`${name}`] = val;
        }
        setAlmacen(_almacen);
    }

    function onCancelar(event) {
        navigate("/almacenes");
    }

    function handleSubmit(event) {
        event.preventDefault();
        setSubmitted(true);
        if (esNuevo) {
            almacenesService.crear(almacen);
        } else {
            almacenesService.modificar(almacen.id, almacen);
        }
        navigate("/almacenes");
    }


    return (
        <div>
            <div className="surface-card border-round shadow-2 p-4">
                {!esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Detalle de almacén</span>}
                {esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Nuevo almacén</span>}

                <form onSubmit={handleSubmit} >
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="id" >ID</label>
                            <InputText id="id" value={almacen.id} readOnly disabled />
                        </div>

                        <div className="p-field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={almacen.nombre} onChange={(e) => onInputChange(e, 'nombre')} required className={classNames({ 'p-invalid': submitted && !almacen.nombre })} />
                            {submitted && !almacen.nombre && <small className="p-error">Debe indicarse un nombre.</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="descripcion">Descripción</label>
                            <InputText id="descripcion" value={almacen.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} />
                        </div>

                        <div className="p-field">
                            <label htmlFor="domicilio">Domicilio</label>
                            <InputText id="domicilio" value={almacen.direccion.domicilio} onChange={(e) => onInputChange(e, 'direccion.domicilio')} />
                        </div>

                        <div className="p-field">
                            <label htmlFor="localidad">Localidad</label>
                            <InputText id="localidad" value={almacen.direccion.localidad} onChange={(e) => onInputChange(e, 'direccion.localidad')} />
                        </div>

                        <div className="p-field">
                            <label htmlFor="codigoPostal">Código postal</label>
                            <InputText id="codigoPostal" value={almacen.direccion.codigoPostal} onChange={(e) => onInputChange(e, 'direccion.codigoPostal')} />
                        </div>

                        <div className="p-field">
                            <label htmlFor="provincia">Provincia</label>
                            <InputText id="provincia" value={almacen.direccion.provincia} onChange={(e) => onInputChange(e, 'direccion.provincia')} />
                        </div>

                        <div className="p-field">
                            <label htmlFor="telefono">Teléfono</label>
                            <InputText id="telefono" value={almacen.direccion.telefono} onChange={(e) => onInputChange(e, 'direccion.telefono')} />
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
