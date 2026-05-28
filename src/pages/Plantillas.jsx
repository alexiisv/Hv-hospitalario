import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  obtenerPlantillas,
  crearPlantilla,
  eliminarPlantilla,
} from "../services/plantillaService";

export default function Plantillas() {
  const [plantillas, setPlantillas] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    tipo_equipo: "",
    descripcion: "",
  });

  const cargarPlantillas = async () => {
    const data = await obtenerPlantillas();
    setPlantillas(data);
  };

  useEffect(() => {
    cargarPlantillas();
  }, []);

  const guardarPlantilla = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      alert("El nombre de la plantilla es obligatorio");
      return;
    }

    await crearPlantilla(form);

    setForm({
      nombre: "",
      tipo_equipo: "",
      descripcion: "",
    });

    cargarPlantillas();
  };

  const borrarPlantilla = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta plantilla?")) return;

    await eliminarPlantilla(id);
    cargarPlantillas();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Plantillas de mantenimiento
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Crea plantillas por familia de equipo para reutilizar actividades y recomendaciones.
        </p>
      </div>

      <form
        onSubmit={guardarPlantilla}
        className="bg-white rounded-2xl shadow-sm border p-6 space-y-4"
      >
        <h3 className="text-lg font-semibold text-slate-800">
          Nueva plantilla
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={form.nombre}
            onChange={(e) =>
              setForm({ ...form, nombre: e.target.value })
            }
            placeholder="Nombre. Ej: PLANTILLA TENSIÓMETRO"
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />

          <input
            value={form.tipo_equipo}
            onChange={(e) =>
              setForm({ ...form, tipo_equipo: e.target.value })
            }
            placeholder="Familia. Ej: TENSIÓMETRO"
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700 transition"
          >
            Crear plantilla
          </button>
        </div>

        <textarea
          value={form.descripcion}
          onChange={(e) =>
            setForm({ ...form, descripcion: e.target.value })
          }
          placeholder="Descripción de la plantilla"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 min-h-[80px]"
        />
      </form>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-5 border-b">
          <h3 className="text-lg font-semibold text-slate-800">
            Plantillas registradas
          </h3>
        </div>

        {plantillas.length === 0 ? (
          <div className="p-6 text-slate-500">
            No hay plantillas registradas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr className="text-left text-slate-600">
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Familia</th>
                  <th className="px-4 py-3">Descripción</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {plantillas.map((plantilla) => (
                  <tr
                    key={plantilla.id}
                    className="border-b last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {plantilla.nombre}
                    </td>

                    <td className="px-4 py-3">
                      {plantilla.tipo_equipo || "Sin familia"}
                    </td>

                    <td className="px-4 py-3">
                      {plantilla.descripcion || "Sin descripción"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/plantillas/${plantilla.id}`}
                          className="rounded-lg bg-green-100 px-3 py-2 text-green-700 hover:bg-green-200"
                        >
                          Gestionar
                        </Link>

                        <button
                          onClick={() => borrarPlantilla(plantilla.id)}
                          className="rounded-lg bg-red-100 px-3 py-2 text-red-700 hover:bg-red-200"
                        >
                          Eliminar
                        </button>
                      </div>
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