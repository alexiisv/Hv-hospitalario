import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  obtenerPlantillaPorId,
  crearActividadPlantilla,
  actualizarActividadPlantilla,
  eliminarActividadPlantilla,
  crearRecomendacionPlantilla,
  actualizarRecomendacionPlantilla,
  eliminarRecomendacionPlantilla,
   aplicarPlantillaACatalogo,
} from "../services/plantillaService";

import { obtenerCatalogo } from "../services/catalogoService";

export default function GestionPlantilla() {
  const { id } = useParams();

  const [plantilla, setPlantilla] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  
  const [nuevaActividad, setNuevaActividad] = useState("");
  const [nuevaRecomendacion, setNuevaRecomendacion] = useState("");

  const cargarDatos = async () => {
    const data = await obtenerPlantillaPorId(id);
    const catalogoData = await obtenerCatalogo();

    setPlantilla(data.plantilla);
    setActividades(data.actividades);
    setRecomendaciones(data.recomendaciones);

    setCatalogo(catalogoData);
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const agregarActividad = async () => {
    if (!nuevaActividad.trim()) return;

    await crearActividadPlantilla(id, {
      numero_actividad: actividades.length + 1,
      actividad: nuevaActividad,
    });

    setNuevaActividad("");
    cargarDatos();
  };

  const editarActividad = async (actividad) => {
    const texto = prompt("Editar actividad", actividad.actividad);
    if (!texto) return;

    await actualizarActividadPlantilla(actividad.id, {
      numero_actividad: actividad.numero_actividad,
      actividad: texto,
    });

    cargarDatos();
  };

  const borrarActividad = async (actividadId) => {
    if (!confirm("¿Eliminar actividad?")) return;

    await eliminarActividadPlantilla(actividadId);
    cargarDatos();
  };

  const agregarRecomendacion = async () => {
    if (!nuevaRecomendacion.trim()) return;

    await crearRecomendacionPlantilla(id, {
      numero_recomendacion: recomendaciones.length + 1,
      recomendacion: nuevaRecomendacion,
    });

    setNuevaRecomendacion("");
    cargarDatos();
  };

  const editarRecomendacion = async (rec) => {
    const texto = prompt("Editar recomendación", rec.recomendacion);
    if (!texto) return;

    await actualizarRecomendacionPlantilla(rec.id, {
      numero_recomendacion: rec.numero_recomendacion,
      recomendacion: texto,
    });

    cargarDatos();
  };

  const borrarRecomendacion = async (recomendacionId) => {
    if (!confirm("¿Eliminar recomendación?")) return;

    await eliminarRecomendacionPlantilla(recomendacionId);
    cargarDatos();
  };

const aplicarPlantilla = async (catalogoId) => {
  const reemplazar = confirm(
    "¿Deseas borrar las actividades/recomendaciones existentes y reemplazarlas por esta plantilla?"
  );

  try {
    await aplicarPlantillaACatalogo(id, catalogoId, reemplazar);

    alert(
      reemplazar
        ? "Plantilla aplicada reemplazando datos anteriores"
        : "Plantilla aplicada sin borrar datos existentes"
    );
  } catch (error) {
    console.error(error);
    alert("Error aplicando plantilla");
  }
};

  if (!plantilla) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        Cargando plantilla...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {plantilla.nombre}
        </h2>
        <p className="text-sm text-slate-500">
          Familia: {plantilla.tipo_equipo || "Sin familia"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Actividades</h3>

          <div className="flex gap-2 mb-4">
            <input
              value={nuevaActividad}
              onChange={(e) => setNuevaActividad(e.target.value)}
              className="flex-1 rounded-xl border px-4 py-2"
              placeholder="Nueva actividad"
            />

            <button
              onClick={agregarActividad}
              className="rounded-xl bg-blue-600 px-4 py-2 text-white"
            >
              Agregar
            </button>
          </div>

          <div className="space-y-3">
            {actividades.map((act) => (
              <div key={act.id} className="rounded-xl bg-slate-50 border p-4">
                <p className="text-sm">
                  <strong>#{act.numero_actividad}</strong> {act.actividad}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => editarActividad(act)}
                    className="text-yellow-600"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => borrarActividad(act.id)}
                    className="text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Recomendaciones</h3>

          <div className="flex gap-2 mb-4">
            <input
              value={nuevaRecomendacion}
              onChange={(e) => setNuevaRecomendacion(e.target.value)}
              className="flex-1 rounded-xl border px-4 py-2"
              placeholder="Nueva recomendación"
            />

            <button
              onClick={agregarRecomendacion}
              className="rounded-xl bg-green-600 px-4 py-2 text-white"
            >
              Agregar
            </button>
          </div>

          <div className="space-y-3">
            {recomendaciones.map((rec) => (
              <div key={rec.id} className="rounded-xl bg-slate-50 border p-4">
                <p className="text-sm">
                  <strong>#{rec.numero_recomendacion}</strong>{" "}
                  {rec.recomendacion}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => editarRecomendacion(rec)}
                    className="text-yellow-600"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => borrarRecomendacion(rec.id)}
                    className="text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border p-6">
  <h3 className="text-xl font-semibold text-slate-800 mb-4">
    Aplicar plantilla a equipos del catálogo
  </h3>

  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead className="bg-slate-50 border-b">
        <tr className="text-left">
          <th className="px-4 py-3">Equipo</th>
          <th className="px-4 py-3">Marca</th>
          <th className="px-4 py-3">Modelo</th>
          <th className="px-4 py-3">Acción</th>
        </tr>
      </thead>

      <tbody>
        {catalogo.map((equipo) => (
          <tr
            key={equipo.id}
            className="border-b hover:bg-slate-50"
          >
            <td className="px-4 py-3">{equipo.equipo}</td>
            <td className="px-4 py-3">{equipo.marca}</td>
            <td className="px-4 py-3">{equipo.modelo}</td>

            <td className="px-4 py-3">
              <button
                onClick={() => aplicarPlantilla(equipo.id)}
                className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
              >
                Aplicar plantilla
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    </div>
  );
}