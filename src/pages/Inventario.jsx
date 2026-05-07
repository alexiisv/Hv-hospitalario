import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerInventario } from "../services/inventarioService";

export default function Inventario() {
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    try {
      const data = await obtenerInventario();
      setInventario(data);
    } catch (error) {
      console.error("Error al cargar inventario:", error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <p className="text-slate-600">Cargando inventario...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Inventario de Equipos
          </h2>
          <p className="text-slate-500 text-sm">
            Consulta los equipos biomédicos registrados en la institución.
          </p>
        </div>

        <Link
          to="/inventario/nuevo"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
        >
          Registrar equipo
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {inventario.length === 0 ? (
          <div className="p-6 text-slate-500">
            No hay equipos en inventario.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr className="text-left text-slate-600">
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Equipo</th>
                  <th className="px-4 py-3 font-semibold">Marca</th>
                  <th className="px-4 py-3 font-semibold">Modelo</th>
                  <th className="px-4 py-3 font-semibold">Serie</th>
                  <th className="px-4 py-3 font-semibold">Área</th>
                  <th className="px-4 py-3 font-semibold">Ubicación</th>
                  <th className="px-4 py-3 font-semibold">Código inventario</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {inventario.map((item) => (
                  <tr key={item.id} className="border-b last:border-b-0 hover:bg-slate-50">
                    <td className="px-4 py-3">{item.id}</td>
                    <td className="px-4 py-3 font-medium text-blue-600">
                        <Link to={`/inventario/${item.id}`} className="hover:underline">
                          {item.equipo}
                        </Link>
                      </td>
                    {/* <td className="px-4 py-3 font-medium text-slate-800">{item.equipo}</td> */}
                    <td className="px-4 py-3">{item.marca}</td>
                    <td className="px-4 py-3">{item.modelo}</td>
                    <td className="px-4 py-3">{item.serie}</td>
                    <td className="px-4 py-3">{item.area}</td>
                    <td className="px-4 py-3">{item.ubicacion}</td>
                    <td className="px-4 py-3">{item.codigo_inventario}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {item.estado_equipo || "Sin estado"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}