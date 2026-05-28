import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  obtenerActividades,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
  obtenerRecomendaciones,
  crearRecomendacion,
  actualizarRecomendacion,
  eliminarRecomendacion,
} from "../services/catalogoGestionService";

const GestionCatalogo = () => {
  const { id } = useParams();

  const [actividades, setActividades] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);

  const [nuevaActividad, setNuevaActividad] = useState("");
  const [nuevaRecomendacion, setNuevaRecomendacion] = useState("");

  const cargarDatos = async () => {
    try {
      const acts = await obtenerActividades(id);
      const recs = await obtenerRecomendaciones(id);

      setActividades(acts);
      setRecomendaciones(recs);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  // ACTIVIDADES

  const agregarActividad = async () => {
    if (!nuevaActividad.trim()) return;

    await crearActividad(id, {
      numero_actividad: actividades.length + 1,
      actividad: nuevaActividad,
    });

    setNuevaActividad("");
    cargarDatos();
  };

  const editarActividad = async (actividad) => {
    const nuevoTexto = prompt(
      "Editar actividad",
      actividad.actividad
    );

    if (!nuevoTexto) return;

    await actualizarActividad(actividad.id, {
      numero_actividad: actividad.numero_actividad,
      actividad: nuevoTexto,
    });

    cargarDatos();
  };

  const borrarActividad = async (actividadId) => {
    if (!window.confirm("¿Eliminar actividad?")) return;

    await eliminarActividad(actividadId);

    cargarDatos();
  };

  // RECOMENDACIONES

  const agregarRecomendacion = async () => {
    if (!nuevaRecomendacion.trim()) return;

    await crearRecomendacion(id, {
      numero_recomendacion: recomendaciones.length + 1,
      recomendacion: nuevaRecomendacion,
    });

    setNuevaRecomendacion("");
    cargarDatos();
  };

  const editarRecomendacion = async (rec) => {
    const nuevoTexto = prompt(
      "Editar recomendación",
      rec.recomendacion
    );

    if (!nuevoTexto) return;

    await actualizarRecomendacion(rec.id, {
      numero_recomendacion: rec.numero_recomendacion,
      recomendacion: nuevoTexto,
    });

    cargarDatos();
  };

  const borrarRecomendacion = async (idRec) => {
    if (!window.confirm("¿Eliminar recomendación?")) return;

    await eliminarRecomendacion(idRec);

    cargarDatos();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Gestión de Actividades y Recomendaciones
          </h1>

          <p className="mt-2 text-slate-600">
            Catálogo ID: {id}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* ACTIVIDADES */}

          <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">
                Actividades de Mantenimiento
              </h2>
            </div>

            <div className="mb-5 flex gap-3">
              <input
                type="text"
                value={nuevaActividad}
                onChange={(e) =>
                  setNuevaActividad(e.target.value)
                }
                placeholder="Nueva actividad..."
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <button
                onClick={agregarActividad}
                className="rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition"
              >
                Agregar
              </button>
            </div>

            <div className="space-y-3">
              {actividades.map((act) => (
                <div
                  key={act.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <span className="mb-1 inline-block rounded-lg bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                        #{act.numero_actividad}
                      </span>

                      <p className="text-sm text-slate-700">
                        {act.actividad}
                      </p>
                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={() => editarActividad(act)}
                        className="rounded-lg bg-yellow-100 px-3 py-2 text-sm text-yellow-700 hover:bg-yellow-200"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() =>
                          borrarActividad(act.id)
                        }
                        className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200"
                      >
                        Eliminar
                      </button>

                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* RECOMENDACIONES */}

          <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">
                Recomendaciones del Fabricante
              </h2>
            </div>

            <div className="mb-5 flex gap-3">
              <input
                type="text"
                value={nuevaRecomendacion}
                onChange={(e) =>
                  setNuevaRecomendacion(e.target.value)
                }
                placeholder="Nueva recomendación..."
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-500"
              />

              <button
                onClick={agregarRecomendacion}
                className="rounded-xl bg-green-600 px-5 py-3 text-white font-medium hover:bg-green-700 transition"
              >
                Agregar
              </button>
            </div>

            <div className="space-y-3">
              {recomendaciones.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <span className="mb-1 inline-block rounded-lg bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                        #{rec.numero_recomendacion}
                      </span>

                      <p className="text-sm text-slate-700">
                        {rec.recomendacion}
                      </p>
                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          editarRecomendacion(rec)
                        }
                        className="rounded-lg bg-yellow-100 px-3 py-2 text-sm text-yellow-700 hover:bg-yellow-200"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() =>
                          borrarRecomendacion(rec.id)
                        }
                        className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200"
                      >
                        Eliminar
                      </button>

                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default GestionCatalogo;