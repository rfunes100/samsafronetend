import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const VehiculosCrud = () => {
    const [vehiculos, setVehiculos] = useState([]);
    const [selectedVehiculo, setSelectedVehiculo] = useState(null);
    const [vehiculoDialog, setVehiculoDialog] = useState(false);
    const [newVehiculo, setNewVehiculo] = useState({ marca: '', modelo: '', placa: '' });



    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchVehiculos();
    }, []);

    const fetchVehiculos = async () => {
        try {
            const response = await axios.get(`${apiUrl}/vehiculos`);
            console.log('response api',response)
            setVehiculos(response.data);
        } catch (error) {
            console.error('Error fetching vehiculos:', error);
        }
    };


    const saveVehiculo = async () => {
        console.log('id',newVehiculo)
        if (newVehiculo._id) {
            console.log('id',newVehiculo._id)
            // Actualizar vehículo existente
            try {
                await axios.patch(`${apiUrl}/vehiculos/${newVehiculo._id}`, newVehiculo);
                setVehiculoDialog(false);
                setNewVehiculo({ id: null, marca: '', modelo: '', placa: '' });
                fetchVehiculos();
            } catch (error) {
                console.error('Error updating vehiculo:', error);
            }
        } else {
            // Crear nuevo vehículo
            try {
                await axios.post(`${apiUrl}/vehiculos`, newVehiculo);
                setVehiculoDialog(false);
                setNewVehiculo({ id: null, marca: '', modelo: '', placa: '' });
                fetchVehiculos();
            } catch (error) {
                console.error('Error saving vehiculo:', error);
            }
        }
    };

    const openNewVehiculoDialog = () => {
        setNewVehiculo({ marca: '', modelo: '', placa: '' });
        setVehiculoDialog(true);
    };

    const openEditVehiculoDialog = (vehiculo) => {
        setNewVehiculo({ ...vehiculo });
        setVehiculoDialog(true);
    };


    const deleteVehiculo = async (id) => {
        try {
            await axios.delete(`${apiUrl}/vehiculos/${id}`);
            fetchVehiculos();
        } catch (error) {
            console.error('Error deleting vehiculo:', error);
        }
    };

    const actionsTemplate = (rowData) => {
        return (
            <div>
            <Button label="Edit" icon="pi pi-pencil" className="p-button-success" onClick={() => openEditVehiculoDialog(rowData)} />
            <Button label="Delete" icon="pi pi-times" className="p-button-danger" onClick={() => deleteVehiculo(rowData._id)} />
        </div>
        );
    };

    return (
        <div>
            <br />
              <Button label="Nuevo Vehículo" icon="pi pi-plus" onClick={openNewVehiculoDialog} />
            <DataTable value={vehiculos} selectionMode="single" onSelectionChange={e => setSelectedVehiculo(e.value)}>
                <Column field="_id" header="ID" />
                <Column field="marca" header="Marca" />
                <Column field="modelo" header="Modelo" />
                <Column field="placa" header="Placa" />
                <Column body={actionsTemplate} header="Actions" />
            </DataTable>

            <Dialog visible={vehiculoDialog} style={{ width: '450px' }} header="Vehículo" modal className="p-fluid" onHide={() => setVehiculoDialog(false)}>
                <div className="p-field">
                    <label htmlFor="marca">Marca</label>
                    <InputText id="marca" value={newVehiculo.marca} onChange={(e) => setNewVehiculo({ ...newVehiculo, marca: e.target.value })} required autoFocus />
                </div>
                <div className="p-field">
                    <label htmlFor="modelo">Modelo</label>
                    <InputText id="modelo" value={newVehiculo.modelo} onChange={(e) => setNewVehiculo({ ...newVehiculo, modelo: e.target.value })} required />
                </div>
                <div className="p-field">
                    <label htmlFor="placa">Placa</label>
                    <InputText id="placa" value={newVehiculo.placa} onChange={( e) => setNewVehiculo({ ...newVehiculo, placa: e.target.value })} required />
                </div>
                <div className="p-dialog-footer">
                    <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setVehiculoDialog(false)} />
                    <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveVehiculo} />
                </div>
            </Dialog>
        </div>
    );
};

export default VehiculosCrud;
