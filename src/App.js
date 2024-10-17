/* import React from 'react';
import MenuComponent from './components/MenuComponent';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
  return (
    <div className="App">
      <MenuComponent />
    </div>
  );
}

export default App;
 */

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MenuComponent from './components/MenuComponent';
import VehiculosCrud from './components/VehiculosCrud';
import MovimientosCrud from './components/MovimientosCrud';





function App() {
  return (
    <div className="App">
      <MenuComponent />
      <Routes>
        <Route path="/vehiculos" element={<VehiculosCrud />} />
        <Route path="/movimientos" element={<MovimientosCrud />} />
        {/* Aquí puedes añadir más rutas si tienes más componentes */}
      </Routes>
    </div>
  );
}

export default App;