import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import CrearInventario from "./pages/CrearInventario";
import DetalleEquipo from "./pages/DetalleEquipo";
import ESEs from "./pages/ESEs";
import InventarioPorESE from "./pages/InventarioPorESE";

import Catalogo from "./pages/Catalogo/Catalogo";
import CrearCatalogo from "./pages/Catalogo/CrearCatalogo";
import EditarCatalogo from "./pages/Catalogo/EditarCatalogo";

import CrearESE from "./pages/CentrosdeSalud/CrearESE";
import EditarESE from "./pages/CentrosdeSalud/EditarESE";

import ImportarInventario from "./pages/Importacion/ImportarInventario";
import GestionCatalogo from "./pages/GestionCatalogo";

import Plantillas from "./pages/Plantillas";
import GestionPlantilla from "./pages/GestionPlantilla";

import ImportarCatalogo from "./pages/ImportarCatalogo";

import {
  FaHome,
  FaDatabase,
  FaHospital,
  FaFileAlt,
  FaHeartbeat,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaCircle,
} from "react-icons/fa";

function Layout() {
  const location = useLocation();

  const [menuAbierto, setMenuAbierto] = useState(true);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      nombre: "Inicio",
      descripcion: "Resumen general del sistema",
      ruta: "/",
      icono: FaHome,
    },
    {
      nombre: "Base de Datos",
      descripcion: "Catálogo maestro de equipos",
      ruta: "/catalogo",
      icono: FaDatabase,
    },
    {
      nombre: "ESEs",
      descripcion: "Instituciones e inventarios",
      ruta: "/eses",
      icono: FaHospital,
    },
    {
      nombre: "Plantillas",
      descripcion: "Formatos y documentación",
      ruta: "/plantillas",
      icono: FaFileAlt,
    },
  ];

  const cerrarMenuMovil = () => {
    if (window.innerWidth < 1024) {
      setMenuAbierto(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Fondo oscuro para dispositivos móviles */}
      {menuAbierto && (
        <button
          type="button"
          onClick={() => setMenuAbierto(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          aria-label="Cerrar menú"
        />
      )}

      {/* Barra lateral */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[290px] overflow-hidden border-r border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl transition-transform duration-300 ease-in-out ${menuAbierto ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Decoraciones de fondo */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex h-full flex-col">
          {/* Encabezado */}
          <div className="border-b border-white/10 px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <Link
                to="/"
                onClick={cerrarMenuMovil}
                className="flex min-w-0 items-center gap-3"
              >
                <div className="relative flex h-14 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-950/40">
                  <FaHeartbeat className="text-xl text-white" />

                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-slate-900 bg-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                </div>

                

                <div className="min-w-0">
                  <h1 className="truncate text-lg font-bold tracking-tight text-white">
                    Sistema Biomédico
                  </h1>

                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    Gestión integral hospitalaria
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMenuAbierto(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                aria-label="Ocultar menú"
              >
                <FaChevronLeft className="text-sm" />
              </button>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 overflow-y-auto px-4 py-5">
            <div className="mb-4 flex items-center gap-3 px-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                Navegación principal
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icono = item.icono;
                const activo = isActive(item.ruta);

                return (
                  <Link
                    key={item.ruta}
                    to={item.ruta}
                    onClick={cerrarMenuMovil}
                    className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 transition-all duration-200 ${activo
                      ? "bg-white text-slate-900 shadow-xl shadow-slate-950/30"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    {/* Indicador lateral */}
                    {activo && (
                      <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-blue-600 to-cyan-400" />
                    )}

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${activo
                        ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-200"
                        : "border border-white/10 bg-white/5 text-slate-400 group-hover:border-blue-400/30 group-hover:bg-blue-500/10 group-hover:text-blue-300"
                        }`}
                    >
                      <Icono className="text-lg" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm font-bold ${activo ? "text-slate-800" : "text-inherit"
                          }`}
                      >
                        {item.nombre}
                      </p>

                      <p
                        className={`mt-0.5 truncate text-xs ${activo ? "text-slate-500" : "text-slate-500"
                          }`}
                      >
                        {item.descripcion}
                      </p>
                    </div>

                    <FaChevronRight
                      className={`shrink-0 text-xs transition-transform duration-200 group-hover:translate-x-1 ${activo ? "text-blue-500" : "text-slate-600"
                        }`}
                    />
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Información inferior */}
          <div className="border-t border-white/10 p-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                  </span>

                  <p className="text-xs font-bold text-emerald-400">
                    Sistema activo
                  </p>
                </div>

                <FaCircle className="text-[5px] text-slate-600" />
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-400">
                Gestión de hojas de vida, inventarios y documentación de equipos
                biomédicos.
              </p>

              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Plataforma local
                </span>

                <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-300">
                  v1.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Botón para abrir el menú */}
      {!menuAbierto && (
        <button
          type="button"
          onClick={() => setMenuAbierto(true)}
          className="fixed left-4 top-4 z-[60] flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-slate-700 shadow-lg shadow-slate-300/50 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 hover:shadow-xl"
          aria-label="Abrir menú"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
            <FaBars className="text-sm" />
          </span>

          <span className="hidden text-sm font-bold sm:block">Menú</span>
        </button>
      )}

      {/* Contenido principal */}
      <main
        className={`min-h-screen transition-all duration-300 ease-in-out ${menuAbierto ? "lg:ml-[290px]" : "lg:ml-0"
          }`}
      >
        <div
          className={`mx-auto max-w-[1700px] px-4 pb-8 sm:px-6 lg:px-8 ${menuAbierto ? "pt-6" : "pt-20 lg:pt-6"
            }`}
        >
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/nuevo" element={<CrearCatalogo />} />
            <Route
              path="/catalogo/editar/:id"
              element={<EditarCatalogo />}
            />
            <Route
              path="/catalogo/gestion/:id"
              element={<GestionCatalogo />}
            />
            <Route
              path="/catalogo/importar"
              element={<ImportarCatalogo />}
            />

            <Route path="/eses" element={<ESEs />} />
            <Route
              path="/eses/:id/inventario"
              element={<InventarioPorESE />}
            />
            <Route
              path="/eses/:eseId/inventario/nuevo"
              element={<CrearInventario />}
            />
            <Route
              path="/eses/:eseId/inventario/importar"
              element={<ImportarInventario />}
            />
            <Route path="/eses/nueva" element={<CrearESE />} />
            <Route path="/eses/editar/:id" element={<EditarESE />} />

            <Route path="/inventario/:id" element={<DetalleEquipo />} />

            <Route path="/plantillas" element={<Plantillas />} />
            <Route
              path="/plantillas/:id"
              element={<GestionPlantilla />}
            />

          </Routes>
        </div>
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