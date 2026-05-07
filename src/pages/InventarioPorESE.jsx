import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerEsePorId, obtenerInventarioPorEse } from "../services/eseService";

export default function InventarioPorESE() {
  const { id } = useParams();

  const [ese, setEse] = useState(null);
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      const [eseData, inventarioData] = await Promise.all([
        obtenerEsePorId(id),
        obtenerInventarioPorEse(id),
      ]);

      setEse(eseData);
      setInventario(inventarioData);
    } catch (error) {
      console.error("Error al cargar inventario por ESE:", error);
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

  if (!ese) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <p className="text-slate-600">No se encontró la ESE.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-slate-100 border flex items-center justify-center overflow-hidden">
            {ese.logo_url ? (
              <img
                src={ese.logo_url}
                alt={ese.nombre}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-xs text-slate-400">LOGO</span>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {ese.nombre}
            </h2>
            <p className="text-sm text-slate-500">
              Inventario biomédico institucional
            </p>
            <p className="text-xs text-slate-400">
              {ese.ciudad} - {ese.departamento} | NIT: {ese.nit || "No registrado"}
            </p>
          </div>
        </div>

        <Link
          to={`/eses/${ese.id}/inventario/nuevo`}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700 transition"
        >
          Registrar equipo
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {inventario.length === 0 ? (
          <div className="p-6 text-slate-500">
            Esta ESE todavía no tiene equipos registrados.
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
                  <th className="px-4 py-3 font-semibold">Código</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                </tr>
              </thead>

              <tbody>
                {inventario.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">{item.id}</td>

                    <td className="px-4 py-3 font-medium text-blue-600">
                      <Link to={`/inventario/${item.id}`} className="hover:underline">
                        {item.equipo}
                      </Link>
                    </td>

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