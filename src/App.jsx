import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Inventario from "./pages/Inventario";
import CrearInventario from "./pages/CrearInventario";
import DetalleEquipo from "./pages/DetalleEquipo";
import ESEs from "./pages/ESEs";
import InventarioPorESE from "./pages/InventarioPorESE";

import Catalogo from "./pages/Catalogo/Catalogo";
import CrearCatalogo from "./pages/Catalogo/CrearCatalogo";
import EditarCatalogo from "./pages/Catalogo/EditarCatalogo";

import CrearESE from "./pages/CentrosdeSalud/CrearESE";
import EditarESE from "./pages/CentrosdeSalud/EditarESE";


function Layout() {
  const location = useLocation();

  const navLinkClass = (path) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      location.pathname === path
        ? "bg-blue-600 text-white shadow"
        : "bg-white text-slate-700 hover:bg-slate-100 border"
    }`;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Sistema de Hoja de Vida Biomédica
            </h1>
            <p className="text-sm text-slate-500">
              Catálogo, inventario y gestión documental
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            <Link to="/" className={navLinkClass("/")}>
              Inicio
            </Link>
            <Link to="/catalogo" className={navLinkClass("/catalogo")}>
              Base de Datos
            </Link>
            <Link to="/eses" className={navLinkClass("/eses")}>
              ESES
            </Link>

            {/* <Link to="/inventario" className={navLinkClass("/inventario")}>
              Inventario
            </Link>
            <Link to="/inventario/nuevo" className={navLinkClass("/inventario/nuevo")}>
              Nuevo equipo
            </Link> */}
           
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/nuevo" element={<CrearCatalogo />} />
          <Route path="/catalogo/editar/:id" element={<EditarCatalogo />} />

          <Route path="/eses" element={<ESEs />} />
          <Route path="/eses/:id/inventario" element={<InventarioPorESE />} />
          <Route path="/eses/:eseId/inventario/nuevo" element={<CrearInventario />} />

          <Route path="/inventario/:id" element={<DetalleEquipo />} />

          <Route path="/eses/nueva" element={<CrearESE />} />
          <Route path="/eses/editar/:id" element={<EditarESE />} />

          {/* <Route path="/inventario" element={<Inventario />} />
          <Route path="/inventario/nuevo" element={<CrearInventario />} /> */}
        
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;