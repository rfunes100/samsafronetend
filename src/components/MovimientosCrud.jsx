import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import '../index.css';

import axios from 'axios';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const MovimientosCrud = () => {
    const [vehiculos, setVehiculos] = useState([]);
    const [showmovimiento, setshowmovimiento] = useState([]);
    const [selectedVehiculo, setSelectedVehiculo] = useState(null);
    const [vehiculoDialog, setVehiculoDialog] = useState(false);
    const [movimiento, setMovimiento] = useState({
        fecha: null,
        hora: '',
        kilometraje: '',
        motorista: '',
        tipomovimiento: '',
        idvehiculo: ''
    });
    const [filterDate, setFilterDate] = useState(null);
  

    const apiUrl = process.env.REACT_APP_API_URL;




    const formatDate = (rowData) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(rowData.fecha).toLocaleDateString(undefined, options);
    };


   

    const dateFilterTemplate = (options) => {
        return (
            <Calendar
                value={options.value}
                onChange={(e) => options.filterApplyCallback(e.value)}
                dateFormat="dd/mm/yy"
                placeholder="Selecciona una fecha"
                showButtonBar
            />
        );
    };

    const dateFilterMatchMode = (value, filter) => {
        if (!filter) return true;
        if (!value) return false;

        const filterDate = new Date(filter).toDateString();
        const valueDate = new Date(value).toDateString();

        return filterDate === valueDate;
    };



    useEffect(() => {
        fetchVehiculos();
    }, []);


   
    const fetchMovimientos = async () => {
        try {
            const response = await axios.get(`${apiUrl}/movimientos`);
            setshowmovimiento(response.data);
        } catch (error) {
            console.error('Error fetching movimientos:', error);
        }
    };

    const fetchVehiculos = async () => {
        try {
            const response = await axios.get(`${apiUrl}/movimientos`);
            console.log('response api',response)
            setshowmovimiento(response.data);
        } catch (error) {
            console.error('Error fetching movimientos:', error);
        }


        try {
            const response = await axios.get(`${apiUrl}/vehiculos`);
            console.log('response api',response)
            setVehiculos(response.data);
        } catch (error) {
            console.error('Error fetching vehiculos:', error);
        }
    };

    const saveVehiculo = async () => {
     
            // Crear nuevo vehículo
            try {
                await axios.post(`${apiUrl}/movimientos`, movimiento);
                setVehiculoDialog(false);
                setMovimiento({ 
                    fecha: null,
                    hora: '',
                    kilometraje: '',
                    motorista: '',
                    tipomovimiento: '',
                    idvehiculo: ''
                 });
                fetchVehiculos();
            } catch (error) {
                console.error('Error saving vehiculo:', error);
            }
        
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMovimiento({ ...movimiento, [name]: value });
    };

    const handleDateChange = (e) => {
        setMovimiento({ ...movimiento, fecha: e.value });
    };

    const handleDropdownChange = (e, field) => {
        setMovimiento({ ...movimiento, [field]: e.value });
    };

    

   

    const tipoMovimientoOptions = [
        { label: 'Entrada', value: 'entrada' },
        { label: 'Salida', value: 'salida' }
    ];
   
    const handleTimeChange = (e) => {
        const date = e.value;
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;
        setMovimiento({ ...movimiento, hora: formattedTime });
    };

    const openNewVehiculoDialog = () => {
        setVehiculoDialog(true);
    };

    const handleFilterDateChange = (e) => {
        setFilterDate(e.value);
    };

    const filterMovimientosByDate = () => {
        if (filterDate) {
            const filtered = showmovimiento.filter(mov => {
                const movDate = new Date(mov.fecha);
                return (
                    movDate.getFullYear() === filterDate.getFullYear() &&
                    movDate.getMonth() === filterDate.getMonth() &&
                    movDate.getDate() === filterDate.getDate()
                );
            });
            setshowmovimiento(filtered);
        } else {
            fetchMovimientos();
        }
    };

    return (
        <div>
            <br />
            <div className="flex-row">
                <Button label="Nuevo Movimiento" icon="pi pi-plus" onClick={openNewVehiculoDialog} />
                <div className="p-field">
                    <label htmlFor="filterDate">Filtrar por Fecha</label>
                    <Calendar id="filterDate" value={filterDate} onChange={handleFilterDateChange} dateFormat="dd/mm/yy" showButtonBar />
                </div>
                <Button label="Aplicar Filtro" icon="pi pi-filter" onClick={filterMovimientosByDate} />
            </div>
           

            <DataTable value={showmovimiento} selectionMode="single" onSelectionChange={e => setSelectedVehiculo(e.value)}>
                <Column field="_id" header="ID" />
                <Column field="idvehiculo.marca" header="Marca" filter filterPlaceholder="Buscar por Marca" />           
                <Column field="idvehiculo.placa" header="Placa" filter filterPlaceholder="Buscar por Placa" />
                <Column  field="fecha" header="Fecha" body={formatDate} />
                <Column field="hora" header="Hora" />
                <Column field="kilometraje" header="Kilometraje" />
                <Column field="motorista" header="Motorista" filter filterPlaceholder="Buscar por Motorista" />
                <Column field="tipomovimiento" header="Movimiento" />

                
            </DataTable>

            <Dialog visible={vehiculoDialog} style={{ width: '450px' }} header="Nuevo Movimiento" modal className="p-fluid" onHide={() => setVehiculoDialog(false)}>
           
            <div className="p-field">
                <label htmlFor="fecha">Fecha</label>
                <Calendar id="fecha" value={movimiento.fecha} onChange={handleDateChange} showIcon dateFormat="dd/mm/yy" />
            </div>
            <div className="p-field">
                <label htmlFor="hora">Hora</label>
                <Calendar id="hora" value={movimiento.hora} onChange={handleTimeChange} timeOnly hourFormat="24" />
                <div>Hora seleccionada: {movimiento.hora}</div>
               
            </div>
            <div className="p-field">
                <label htmlFor="kilometraje">Kilometraje</label>
                <InputText id="kilometraje" name="kilometraje" value={movimiento.kilometraje} onChange={handleInputChange} required />
            </div>
            <div className="p-field">
                <label htmlFor="motorista">Motorista</label>
                <InputText id="motorista" name="motorista" value={movimiento.motorista} onChange={handleInputChange} required />
            </div>
            <div className="p-field">
                <label htmlFor="tipomovimiento">Movimiento</label>
                <Dropdown id="tipomovimiento" name="tipomovimiento" value={movimiento.tipomovimiento} options={tipoMovimientoOptions} onChange={(e) => handleDropdownChange(e, 'tipomovimiento')} placeholder="Selecciona un tipo de movimiento" />
            </div>
            <div className="p-field">
                <label htmlFor="idvehiculo">Vehículo</label>
                <Dropdown id="idvehiculo" name="idvehiculo" value={movimiento.idvehiculo} options={vehiculos.map(vehiculo => ({ label: `${vehiculo.marca} ${vehiculo.modelo}`, value: vehiculo._id }))} onChange={(e) => handleDropdownChange(e, 'idvehiculo')} placeholder="Selecciona un vehículo" />
           
                
            </div>
            <div className="p-dialog-footer">
            
                <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setVehiculoDialog(false)} />
                <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveVehiculo} />
            </div>
        </Dialog>

        </div>
    );
};

export default MovimientosCrud;
