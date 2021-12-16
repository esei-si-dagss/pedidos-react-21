import React, { useState, useEffect } from 'react';

import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';

import { useParams, useNavigate } from "react-router-dom";

import articulosService from '../../services/articulosService';
import familiasService from '../../services/familiasService';

export default function ArticulosDetalle() {

    const params = useParams();
    const navigate = useNavigate();
    const esNuevo = !('idArticulo' in params);

    const articuloVacio = { id: null, nombre: "", descripcion: "", familia: { id: null, nombre: "", descripcion: "" }, precioUnitario: 0.0 };
    const [articulo, setArticulo] = useState(articuloVacio);
    const [submitted, setSubmitted] = useState(false);
    const [familias, setFamilias] = useState([]);


    useEffect(() => {
        if (!esNuevo) {
            articulosService.buscarPorId(params.idArticulo).then(res => setArticulo(res.data));
        }
        familiasService.buscarTodas().then(res => setFamilias(res.data));
    }, []);


    function onInputChange(e, name) {
        const val = (e.target && e.target.value) || '';
        let _articulo = { ...articulo };
        _articulo[`${name}`] = val;
        setArticulo(_articulo);
    }

    function onFamiliaChange(e) {
        let _articulo = { ...articulo };
        _articulo.familia = e.value;
        setArticulo(_articulo);
    }

    function onPrecioUnitarioChange(e) {
        let _articulo = { ...articulo };
        _articulo.precioUnitario = e.value;
        setArticulo(_articulo);
    }


    function onCancelar(event) {
        navigate("/articulos");
    }

    function handleSubmit(event) {
        event.preventDefault();
        setSubmitted(true);
        if (esNuevo) {
            articulosService.crear(articulo);
        } else {
            articulosService.modificar(articulo.id, articulo);
        }
        navigate("/articulos");
    }


    return (
        <div>
            <div className="surface-card border-round shadow-2 p-4">
                {!esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Detalle de artículo</span>}
                {esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Nuevo artículo</span>}

                <form onSubmit={handleSubmit} >
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="id" >ID</label>
                            <InputText id="id" value={articulo.id} readOnly disabled />
                        </div>

                        <div className="p-field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={articulo.nombre} onChange={(e) => onInputChange(e, 'nombre')} required className={classNames({ 'p-invalid': submitted && !articulo.nombre })} />
                            {submitted && !articulo.nombre && <small className="p-error">Debe indicarse un nombre.</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="descripcion">Descripción</label>
                            <InputText id="descripcion" value={articulo.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} />
                        </div>

                        <div className="p-field">
                            <label htmlFor="familia">Familia</label>
                            <Dropdown value={articulo.familia} options={familias} onChange={onFamiliaChange} optionLabel="nombre"
                                filter showClear filterBy="nombre" placeholder="Seleccionar familia" />
                        </div>

                        <div className="p-field">
                            <label htmlFor="precio">Precio unitario</label>
                            <InputNumber id="precio" value={articulo.precioUnitario} onChange={(e) => onPrecioUnitarioChange(e)} mode="currency" currency="EUR" locale="es-ES" />
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
