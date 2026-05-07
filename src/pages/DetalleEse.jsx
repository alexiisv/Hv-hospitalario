import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerEsePorId, obtenerInventarioPorEse } from "../services/eseService";

export default function DetalleEse() {
  const { id } = useParams();
  const [ese, setEse] = useState(null);
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDetalle();
  }, [id]);

  const cargarDetalle = async () => {
    try {
      const [eseData, inventarioData] = await Promise.all([
        obtenerEsePorId(id),
        obtenerInventarioPorEse(id),
      ]);

      setEse(eseData);
      setInventario(inventarioData);
    } catch (error) {
      console.error("Error al cargar detalle de ESE:", error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <p className="text-slate-600">Cargando detalle de la ESE...</p>
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
      <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{ese.nombre}</h2>
          <p className="text-sm text-slate-500 mt-1">
            {ese.ciudad || "Sin ciudad"} · {ese.departamento || "Sin departamento"}
          </p>
          <div className="mt-3 text-sm text-slate-600 space-y-1">
            <p><span className="font-medium">NIT:</span> {ese.nit || "NA"}</p>
            <p><span className="font-medium">Dirección:</span> {ese.direccion || "NA"}</p>
            <p><span className="font-medium">Teléfono:</span> {ese.telefono || "NA"}</p>
            <p><span className="font-medium">Correo:</span> {ese.email || "NA"}</p>
          </div>
        </div>

        <Link
          to={`/inventario/nuevo?ese_id=${ese.id}`}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
        >
          Registrar equipo en esta ESE
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">
            Inventario de la institución
          </h3>
          <p className="text-sm text-slate-500">
            Equipos registrados: {inventario.length}
          </p>
        </div>

        {inventario.length === 0 ? (
          <div className="p-6 text-slate-500">
            Esta ESE aún no tiene equipos registrados.
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
                    <td className="px-4 py-3">{item.marca}</td>
                    <td className="px-4 py-3">{item.modelo}</td>
                    <td className="px-4 py-3">{item.serie}</td>
                    <td className="px-4 py-3">{item.area}</td>
                    <td className="px-4 py-3">{item.ubicacion}</td>
                    <td className="px-4 py-3">{item.codigo_inventario}</td>
                    <td className="px-4 py-3">{item.estado_equipo}</td>
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