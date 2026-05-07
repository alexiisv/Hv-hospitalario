import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerEses, eliminarEse } from "../services/eseService";


export default function ESEs() {
  const [eses, setEses] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarEses();
  }, []);

  const cargarEses = async () => {
    try {
      const data = await obtenerEses();
      setEses(data);
    } catch (error) {
      console.error("Error al cargar ESEs:", error);
    } finally {
      setCargando(false);
    }
  };

  const eliminar = async (id) => {
  const confirmar = confirm("¿Seguro que deseas eliminar esta ESE?");
  if (!confirmar) return;

  try {
    await eliminarEse(id);
    cargarEses();
  } catch (error) {
    console.error("Error al eliminar ESE:", error);
    alert("No se pudo eliminar la ESE. Puede tener equipos asociados.");
  }
};

  if (cargando) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <p className="text-slate-600">Cargando ESEs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Instituciones ESE
        </h2>
        <p className="text-sm text-slate-500">
          Selecciona una institución para consultar su inventario biomédico.
        </p>
        <Link
            to="/eses/nueva"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700 transition"
          >
          Nueva ESE
        </Link>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {eses.map((ese) => (
          <div
            key={ese.id}
            className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-100 border flex items-center justify-center overflow-hidden">
                {ese.logo_url ? (
                  <img
                    src={ese.logo_url}
                    alt={ese.nombre}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400 text-center">
                    LOGO
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-slate-800 leading-snug">
                  {ese.nombre}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {ese.ciudad || "Sin ciudad"} - {ese.departamento || "Sin departamento"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  NIT: {ese.nit || "No registrado"}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold">Dirección:</span>{" "}
                {ese.direccion || "No registrada"}
              </p>
              <p>
                <span className="font-semibold">Teléfono:</span>{" "}
                {ese.telefono || "No registrado"}
              </p>
              <p>
                <span className="font-semibold">Estado:</span>{" "}
                <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  {ese.estado || "ACTIVA"}
                </span>
              </p>
            </div>

            <div className="mt-5">
              <Link
                to={`/eses/${ese.id}/inventario`}
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700 transition"
              >
                Entrar al inventario
              </Link>
                <div className="mt-3 flex gap-2">
  <Link
    to={`/eses/editar/${ese.id}`}
    className="flex-1 text-center rounded-xl border border-slate-300 px-4 py-2 text-slate-700 font-medium hover:bg-slate-50 transition"
  >
    Edit
  </Link>

  <button
    onClick={() => eliminar(ese.id)}
    className="flex-1 rounded-xl border border-red-200 px-4 py-2 text-red-600 font-medium hover:bg-red-50 transition"
  >
    Eliminar
  </button>
</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


}