import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerEses, eliminarEse } from "../services/eseService";
import {
  FaHospital,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaIdCard,
  FaArrowRight,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

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
      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-slate-500">Cargando ESEs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 p-8 text-white shadow-lg">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-24 left-20 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl"></div>

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
              <FaHospital />
              Gestión institucional
            </div>

            <h2 className="text-3xl font-bold md:text-4xl">
              Instituciones ESE
            </h2>

            <p className="mt-2 max-w-2xl text-blue-100">
              Administra las instituciones, consulta su inventario biomédico y
              genera hojas de vida técnicas por cada equipo registrado.
            </p>
          </div>
{/* 
          <Link
            to="/eses/nueva"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 shadow hover:bg-blue-50 transition"
          >
            <FaPlus />
            Nueva ESE
          </Link> */}
        </div>
      </div>

      {eses.length === 0 ? (
        <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
          <FaHospital className="mx-auto mb-4 text-5xl text-slate-300" />
          <h3 className="text-xl font-bold text-slate-700">
            No hay instituciones registradas
          </h3>
          <p className="mt-2 text-slate-500">
            Crea una nueva ESE para empezar a registrar equipos biomédicos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {eses.map((ese) => (
            <div
              key={ese.id}
              className="group relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500"></div>

              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-slate-50 shadow-sm">
                  {ese.logo_url ? (
                    <img
                      src={ese.logo_url}
                      alt={ese.nombre}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <FaHospital className="text-2xl text-slate-300" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 font-bold leading-snug text-slate-800">
                    {ese.nombre}
                  </h3>

                  <div className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {ese.estado || "ACTIVA"}
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <span>
                    {ese.ciudad || "Sin ciudad"} -{" "}
                    {ese.departamento || "Sin departamento"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <FaIdCard className="text-purple-500" />
                  <span>NIT: {ese.nit || "No registrado"}</span>
                </div>

                <div className="flex items-center gap-3">
                  <FaPhoneAlt className="text-emerald-500" />
                  <span>{ese.telefono || "No registrado"}</span>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Dirección
                  </p>
                  <p className="mt-1 text-slate-700">
                    {ese.direccion || "No registrada"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <Link
                  to={`/eses/${ese.id}/inventario`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Inventario
                  <FaArrowRight />
                </Link>

                <Link
                  to={`/eses/editar/${ese.id}`}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
                  title="Editar ESE"
                >
                  <FaEdit />
                </Link>

                <button
                  onClick={() => eliminar(ese.id)}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-red-200 text-red-600 transition hover:bg-red-50"
                  title="Eliminar ESE"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}