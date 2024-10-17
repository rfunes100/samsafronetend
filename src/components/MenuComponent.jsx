import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Link } from 'react-router-dom';

const Menu = () => {
    const items = [
        {
            label: 'Vehículos',
            icon: 'pi pi-fw pi-car',
            template: (item, options) => {
                return (
                    <Link to="/vehiculos" className={options.className} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <span className={options.icon}></span>
                        <span className={options.labelClassName}>{item.label}</span>
                    </Link>
                );
            }
        },
        {
            label: 'Movimientos',
            icon: 'pi pi-fw pi-exchange',
            template: (item, options) => {
                return (
                    <Link to="/movimientos" className={options.className} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <span className={options.icon}></span>
                        <span className={options.labelClassName}>{item.label}</span>
                    </Link>
                );
            }
        }
    ];

    return (
        <div>
            <Menubar model={items} />
        </div>
    );
};


export default Menu