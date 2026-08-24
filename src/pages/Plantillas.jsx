import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Plus,
  Search,
  Trash2,
  Settings2,
  Layers3,
  FileText,
  Loader2,
  AlertCircle,
  Pencil,
  Save,
  X,
} from "lucide-react";

import {
  obtenerPlantillas,
  crearPlantilla,
  eliminarPlantilla,
  actualizarPlantilla,
} from "../services/plantillaService";

const formularioInicial = {
  nombre: "",
  tipo_equipo: "",
  descripcion: "",
};

export default function Plantillas() {
  const [plantillas, setPlantillas] = useState([]);
  const [form, setForm] = useState(formularioInicial);

  const [busqueda, setBusqueda] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [eliminandoId, setEliminandoId] = useState(null);

  const [editandoId, setEditandoId] = useState(null);

  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  const [formEdicion, setFormEdicion] = useState({
    nombre: "",
    tipo_equipo: "",
    descripcion: "",
  });

  const [error, setError] = useState("");

  // =========================================================
  // CARGAR PLANTILLAS
  // =========================================================

  const cargarPlantillas = async () => {
    try {
      setCargando(true);
      setError("");

      const data = await obtenerPlantillas();

      setPlantillas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar plantillas:", error);

      setError("No fue posible cargar las plantillas.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPlantillas();
  }, []);

  // =========================================================
  // CREAR PLANTILLA
  // =========================================================

  const guardarPlantilla = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      alert("El nombre de la plantilla es obligatorio.");
      return;
    }

    if (!form.tipo_equipo.trim()) {
      alert("Debes indicar la familia o tipo de equipo.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      await crearPlantilla({
        nombre: form.nombre.trim(),
        tipo_equipo: form.tipo_equipo.trim(),
        descripcion: form.descripcion.trim(),
      });

      setForm(formularioInicial);

      await cargarPlantillas();
    } catch (error) {
      console.error("Error al crear plantilla:", error);

      setError("No fue posible crear la plantilla.");
    } finally {
      setGuardando(false);
    }
  };

  // =========================================================
  // ELIMINAR PLANTILLA
  // =========================================================

  const borrarPlantilla = async (id, nombre) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar la plantilla "${nombre}"?`
    );

    if (!confirmar) return;

    try {
      setEliminandoId(id);
      setError("");

      await eliminarPlantilla(id);

      await cargarPlantillas();
    } catch (error) {
      console.error("Error al eliminar plantilla:", error);

      setError("No fue posible eliminar la plantilla.");
    } finally {
      setEliminandoId(null);
    }
  };

  // =========================================================
  // EDITAR PLANTILLA
  // =========================================================

  const iniciarEdicion = (plantilla) => {
    setEditandoId(plantilla.id);

    setFormEdicion({
      nombre: plantilla.nombre || "",
      tipo_equipo: plantilla.tipo_equipo || "",
      descripcion: plantilla.descripcion || "",
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);

    setFormEdicion({
      nombre: "",
      tipo_equipo: "",
      descripcion: "",
    });
  };

  const guardarEdicion = async (id) => {
    if (!formEdicion.nombre.trim()) {
      alert("El nombre de la plantilla es obligatorio.");
      return;
    }

    if (!formEdicion.tipo_equipo.trim()) {
      alert("La familia o tipo de equipo es obligatoria.");
      return;
    }

    try {
      setGuardandoEdicion(true);
      setError("");

      await actualizarPlantilla(id, {
        nombre: formEdicion.nombre.trim(),
        tipo_equipo: formEdicion.tipo_equipo.trim(),
        descripcion: formEdicion.descripcion.trim(),
      });

      setEditandoId(null);

      setFormEdicion({
        nombre: "",
        tipo_equipo: "",
        descripcion: "",
      });

      await cargarPlantillas();
    } catch (error) {
      console.error("Error al actualizar plantilla:", error);

      setError("No fue posible actualizar la plantilla.");
    } finally {
      setGuardandoEdicion(false);
    }
  };

  // =========================================================
  // FILTRO
  // =========================================================

  const plantillasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return plantillas;

    return plantillas.filter((plantilla) => {
      return (
        plantilla.nombre?.toLowerCase().includes(texto) ||
        plantilla.tipo_equipo?.toLowerCase().includes(texto) ||
        plantilla.descripcion?.toLowerCase().includes(texto)
      );
    });
  }, [plantillas, busqueda]);

  // =========================================================
  // TOTAL FAMILIAS
  // =========================================================

  const familiasRegistradas = useMemo(() => {
    const familias = plantillas
      .map((plantilla) => plantilla.tipo_equipo?.trim())
      .filter(Boolean);

    return new Set(familias).size;
  }, [plantillas]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6">
      {/* =====================================================
          ENCABEZADO
      ====================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 p-8 text-white shadow-lg">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
                <ClipboardList size={30} />
              </div>

              <div>
                <p className="mb-1 text-sm font-medium text-blue-100">
                  Gestión técnica
                </p>

                <h1 className="text-2xl font-bold md:text-3xl">
                  Plantillas de mantenimiento
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-blue-100 md:text-base">
                  Administra actividades y recomendaciones por familia de
                  equipos biomédicos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="min-w-[135px] rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wide text-blue-100">
                  Plantillas
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {plantillas.length}
                </p>
              </div>

              <div className="min-w-[135px] rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wide text-blue-100">
                  Familias
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {familiasRegistradas}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle size={20} />

          <span>{error}</span>
        </div>
      )}

      {/* =====================================================
          CREAR PLANTILLA
      ====================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
            <Plus size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">
              Crear nueva plantilla
            </h2>

            <p className="text-sm text-slate-500">
              Define la familia de equipos a la cual se aplicará.
            </p>
          </div>
        </div>

        <form onSubmit={guardarPlantilla} className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <CampoFormulario
              label="Nombre de la plantilla"
              requerido
            >
              <input
                type="text"
                value={form.nombre}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    nombre: e.target.value,
                  }))
                }
                placeholder="Ejemplo: Mantenimiento de tensiómetros"
                className="input-profesional"
              />
            </CampoFormulario>

            <CampoFormulario
              label="Familia o tipo de equipo"
              requerido
            >
              <input
                type="text"
                value={form.tipo_equipo}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    tipo_equipo: e.target.value,
                  }))
                }
                placeholder="Ejemplo: Tensiómetro"
                className="input-profesional"
              />
            </CampoFormulario>
          </div>

          <CampoFormulario label="Descripción">
            <textarea
              value={form.descripcion}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
                }))
              }
              placeholder="Describe brevemente el objetivo y alcance de la plantilla..."
              rows={3}
              className="input-profesional resize-y"
            />
          </CampoFormulario>

          <div className="flex justify-end border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={guardando}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {guardando ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Guardando...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Crear plantilla
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* =====================================================
          LISTADO
      ====================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-slate-800">
              Plantillas registradas
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {plantillasFiltradas.length} plantilla(s) encontrada(s)
            </p>
          </div>

          {/* BUSCADOR */}

          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar plantilla o familia..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* ===================================================
            CARGANDO
        ==================================================== */}

        {cargando ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2
                size={22}
                className="animate-spin"
              />

              Cargando plantillas...
            </div>
          </div>
        ) : plantillasFiltradas.length === 0 ? (
          /* =================================================
              SIN RESULTADOS
          ================================================== */

          <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
              <Layers3 size={30} />
            </div>

            <h3 className="font-semibold text-slate-700">
              No hay plantillas para mostrar
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Crea una nueva plantilla o modifica el criterio de búsqueda.
            </p>
          </div>
        ) : (
          /* =================================================
              TARJETAS
          ================================================== */

          <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-2 xl:grid-cols-3">
            {plantillasFiltradas.map((plantilla) => (
              <article
                key={plantilla.id}
                className={`group flex flex-col rounded-2xl border bg-white p-5 transition ${
                  editandoId === plantilla.id
                    ? "border-amber-300 shadow-lg ring-4 ring-amber-50"
                    : "border-slate-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
                }`}
              >
                {/* =============================================
                    MODO EDICIÓN
                ============================================== */}

                {editandoId === plantilla.id ? (
                  <>
                    <div className="mb-5 flex items-center gap-3">
                      <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                        <Pencil size={22} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800">
                          Editar plantilla
                        </h3>

                        <p className="text-xs text-slate-500">
                          Modifica los datos y guarda los cambios.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* NOMBRE */}

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                          Nombre
                        </label>

                        <input
                          type="text"
                          value={formEdicion.nombre}
                          onChange={(e) =>
                            setFormEdicion((prev) => ({
                              ...prev,
                              nombre: e.target.value,
                            }))
                          }
                          className="input-profesional"
                        />
                      </div>

                      {/* FAMILIA */}

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                          Familia o tipo de equipo
                        </label>

                        <input
                          type="text"
                          value={formEdicion.tipo_equipo}
                          onChange={(e) =>
                            setFormEdicion((prev) => ({
                              ...prev,
                              tipo_equipo: e.target.value,
                            }))
                          }
                          className="input-profesional"
                        />
                      </div>

                      {/* DESCRIPCIÓN */}

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                          Descripción
                        </label>

                        <textarea
                          rows={3}
                          value={formEdicion.descripcion}
                          onChange={(e) =>
                            setFormEdicion((prev) => ({
                              ...prev,
                              descripcion: e.target.value,
                            }))
                          }
                          className="input-profesional resize-y"
                        />
                      </div>
                    </div>

                    {/* BOTONES EDICIÓN */}

                    <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        disabled={guardandoEdicion}
                        onClick={() =>
                          guardarEdicion(plantilla.id)
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {guardandoEdicion ? (
                          <>
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />

                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save size={17} />
                            Guardar cambios
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={guardandoEdicion}
                        onClick={cancelarEdicion}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        <X size={17} />
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  /* ===========================================
                      MODO NORMAL
                  ============================================ */

                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="shrink-0 rounded-xl bg-blue-50 p-3 text-blue-600">
                          <FileText size={22} />
                        </div>

                        <div className="min-w-0">
                          <h3
                            className="truncate font-semibold text-slate-800"
                            title={plantilla.nombre}
                          >
                            {plantilla.nombre}
                          </h3>

                          <span className="mt-1 inline-flex rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
                            {plantilla.tipo_equipo ||
                              "Sin familia"}
                          </span>
                        </div>
                      </div>

                      {/* EDITAR ARRIBA */}

                      {/* <button
                        type="button"
                        onClick={() =>
                          iniciarEdicion(plantilla)
                        }
                        className="shrink-0 rounded-xl border border-amber-200 bg-amber-50 p-2 text-amber-600 transition hover:bg-amber-100"
                        title="Editar plantilla"
                      >
                        <Pencil size={17} />
                      </button> */}
                    </div>

                    {/* DESCRIPCIÓN */}

                    <p className="mt-4 line-clamp-3 min-h-[60px] text-sm leading-6 text-slate-500">
                      {plantilla.descripcion ||
                        "Esta plantilla no tiene una descripción registrada."}
                    </p>

                    {/* ACCIONES */}

                    <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                      {/* GESTIONAR */}

                      <Link
                        to={`/plantillas/${plantilla.id}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        <Settings2 size={17} />
                        Gestionar
                      </Link>

                      {/* EDITAR */}

                      <button
                        type="button"
                        onClick={() =>
                          iniciarEdicion(plantilla)
                        }
                        className="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-amber-600 transition hover:bg-amber-100"
                        title="Editar plantilla"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* ELIMINAR */}

                      <button
                        type="button"
                        disabled={
                          eliminandoId === plantilla.id
                        }
                        onClick={() =>
                          borrarPlantilla(
                            plantilla.id,
                            plantilla.nombre
                          )
                        }
                        className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Eliminar plantilla"
                      >
                        {eliminandoId === plantilla.id ? (
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================
          ESTILOS
      ====================================================== */}

      <style>{`
        .input-profesional {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(203 213 225);
          background: rgb(248 250 252);
          padding: 0.7rem 0.9rem;
          font-size: 0.875rem;
          color: rgb(30 41 59);
          outline: none;
          transition: all 0.2s;
        }

        .input-profesional:focus {
          border-color: rgb(59 130 246);
          background: white;
          box-shadow: 0 0 0 4px rgb(219 234 254);
        }
      `}</style>
    </div>
  );
}

// ===========================================================
// COMPONENTE CAMPO FORMULARIO
// ===========================================================

function CampoFormulario({
  label,
  requerido = false,
  children,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {requerido && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}