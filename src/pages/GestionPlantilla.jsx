import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Search,
  Wrench,
  Lightbulb,
  PackageCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

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
  const navigate = useNavigate();

  const [plantilla, setPlantilla] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [catalogo, setCatalogo] = useState([]);

  const [nuevaActividad, setNuevaActividad] = useState("");
  const [nuevaRecomendacion, setNuevaRecomendacion] = useState("");

  const [actividadEditando, setActividadEditando] = useState(null);
  const [textoActividadEditando, setTextoActividadEditando] = useState("");

  const [recomendacionEditando, setRecomendacionEditando] = useState(null);
  const [textoRecomendacionEditando, setTextoRecomendacionEditando] =
    useState("");

  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [aplicandoId, setAplicandoId] = useState(null);

  const [mensaje, setMensaje] = useState(null);

  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [mostrarModalAplicar, setMostrarModalAplicar] = useState(false);

  const [equiposAplicados, setEquiposAplicados] = useState([]);

  // ============================================================
  // CARGAR INFORMACIÓN
  // ============================================================

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const [dataPlantilla, catalogoData] = await Promise.all([
        obtenerPlantillaPorId(id),
        obtenerCatalogo(),
      ]);

      setPlantilla(dataPlantilla.plantilla);

      setActividades(
        [...(dataPlantilla.actividades || [])].sort(
          (a, b) => a.numero_actividad - b.numero_actividad
        )
      );

      setRecomendaciones(
        [...(dataPlantilla.recomendaciones || [])].sort(
          (a, b) => a.numero_recomendacion - b.numero_recomendacion
        )
      );

      setCatalogo(catalogoData || []);
    } catch (error) {
      console.error("Error cargando plantilla:", error);

      mostrarMensaje(
        "error",
        "No fue posible cargar la información de la plantilla."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  // ============================================================
  // MENSAJES
  // ============================================================

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({
      tipo,
      texto,
    });

    setTimeout(() => {
      setMensaje(null);
    }, 4000);
  };

  // ============================================================
  // ACTIVIDADES
  // ============================================================

  const agregarActividad = async () => {
    const texto = nuevaActividad.trim();

    if (!texto) return;

    try {
      setGuardando(true);

      const siguienteNumero =
        actividades.length > 0
          ? Math.max(...actividades.map((a) => a.numero_actividad)) + 1
          : 1;

      await crearActividadPlantilla(id, {
        numero_actividad: siguienteNumero,
        actividad: texto,
      });

      setNuevaActividad("");

      await cargarDatos();

      mostrarMensaje("success", "Actividad agregada correctamente.");
    } catch (error) {
      console.error(error);

      mostrarMensaje("error", "No fue posible agregar la actividad.");
    } finally {
      setGuardando(false);
    }
  };

  const iniciarEdicionActividad = (actividad) => {
    setActividadEditando(actividad.id);
    setTextoActividadEditando(actividad.actividad);
  };

  const cancelarEdicionActividad = () => {
    setActividadEditando(null);
    setTextoActividadEditando("");
  };

  const guardarEdicionActividad = async (actividad) => {
    const texto = textoActividadEditando.trim();

    if (!texto) return;

    try {
      setGuardando(true);

      await actualizarActividadPlantilla(actividad.id, {
        numero_actividad: actividad.numero_actividad,
        actividad: texto,
      });

      cancelarEdicionActividad();

      await cargarDatos();

      mostrarMensaje("success", "Actividad actualizada correctamente.");
    } catch (error) {
      console.error(error);

      mostrarMensaje("error", "No fue posible actualizar la actividad.");
    } finally {
      setGuardando(false);
    }
  };

  const borrarActividad = async (actividadId) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar esta actividad?"
    );

    if (!confirmar) return;

    try {
      await eliminarActividadPlantilla(actividadId);

      await cargarDatos();

      mostrarMensaje("success", "Actividad eliminada.");
    } catch (error) {
      console.error(error);

      mostrarMensaje("error", "No fue posible eliminar la actividad.");
    }
  };

  // ============================================================
  // RECOMENDACIONES
  // ============================================================

  const agregarRecomendacion = async () => {
    const texto = nuevaRecomendacion.trim();

    if (!texto) return;

    try {
      setGuardando(true);

      const siguienteNumero =
        recomendaciones.length > 0
          ? Math.max(
            ...recomendaciones.map((r) => r.numero_recomendacion)
          ) + 1
          : 1;

      await crearRecomendacionPlantilla(id, {
        numero_recomendacion: siguienteNumero,
        recomendacion: texto,
      });

      setNuevaRecomendacion("");

      await cargarDatos();

      mostrarMensaje("success", "Recomendación agregada correctamente.");
    } catch (error) {
      console.error(error);

      mostrarMensaje(
        "error",
        "No fue posible agregar la recomendación."
      );
    } finally {
      setGuardando(false);
    }
  };

  const iniciarEdicionRecomendacion = (recomendacion) => {
    setRecomendacionEditando(recomendacion.id);
    setTextoRecomendacionEditando(recomendacion.recomendacion);
  };

  const cancelarEdicionRecomendacion = () => {
    setRecomendacionEditando(null);
    setTextoRecomendacionEditando("");
  };

  const guardarEdicionRecomendacion = async (recomendacion) => {
    const texto = textoRecomendacionEditando.trim();

    if (!texto) return;

    try {
      setGuardando(true);

      await actualizarRecomendacionPlantilla(recomendacion.id, {
        numero_recomendacion: recomendacion.numero_recomendacion,
        recomendacion: texto,
      });

      cancelarEdicionRecomendacion();

      await cargarDatos();

      mostrarMensaje(
        "success",
        "Recomendación actualizada correctamente."
      );
    } catch (error) {
      console.error(error);

      mostrarMensaje(
        "error",
        "No fue posible actualizar la recomendación."
      );
    } finally {
      setGuardando(false);
    }
  };

  const borrarRecomendacion = async (recomendacionId) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar esta recomendación?"
    );

    if (!confirmar) return;

    try {
      await eliminarRecomendacionPlantilla(recomendacionId);

      await cargarDatos();

      mostrarMensaje("success", "Recomendación eliminada.");
    } catch (error) {
      console.error(error);

      mostrarMensaje(
        "error",
        "No fue posible eliminar la recomendación."
      );
    }
  };

  // ============================================================
  // APLICAR PLANTILLA AL CATÁLOGO
  // ============================================================

  // const aplicarPlantilla = async (equipo) => {
  //   const reemplazar = window.confirm(
  //     `¿Deseas REEMPLAZAR las actividades y recomendaciones actuales de "${equipo.equipo}"?\n\n` +
  //     `Aceptar: reemplaza las existentes.\n` +
  //     `Cancelar: conserva las existentes y agrega la plantilla.`
  //   );

  //   try {
  //     setAplicandoId(equipo.id);

  //     await aplicarPlantillaACatalogo(
  //       id,
  //       equipo.id,
  //       reemplazar
  //     );

  //     mostrarMensaje(
  //       "success",
  //       reemplazar
  //         ? `Plantilla aplicada a ${equipo.equipo} reemplazando la información anterior.`
  //         : `Plantilla agregada a ${equipo.equipo} conservando la información anterior.`
  //     );
  //   } catch (error) {
  //     console.error(error);

  //     mostrarMensaje(
  //       "error",
  //       `No fue posible aplicar la plantilla a ${equipo.equipo}.`
  //     );
  //   } finally {
  //     setAplicandoId(null);
  //   }
  // };

  const abrirModalAplicar = (equipo) => {
    setEquipoSeleccionado(equipo);
    setMostrarModalAplicar(true);
  };

  const cerrarModalAplicar = () => {
    if (aplicandoId) return;

    setMostrarModalAplicar(false);
    setEquipoSeleccionado(null);
  };

  const confirmarAplicacion = async (reemplazar) => {
    if (!equipoSeleccionado) return;

    try {
      setAplicandoId(equipoSeleccionado.id);

      await aplicarPlantillaACatalogo(
        id,
        equipoSeleccionado.id,
        reemplazar
      );

      setEquiposAplicados((anteriores) => {
        if (anteriores.includes(equipoSeleccionado.id)) {
          return anteriores;
        }

        return [...anteriores, equipoSeleccionado.id];
      });

      mostrarMensaje(
        "success",
        reemplazar
          ? `Plantilla aplicada a ${equipoSeleccionado.equipo}. Se reemplazaron las actividades y recomendaciones anteriores.`
          : `Plantilla aplicada a ${equipoSeleccionado.equipo}. Se conservaron las actividades y recomendaciones existentes.`
      );

      setMostrarModalAplicar(false);
      setEquipoSeleccionado(null);
    } catch (error) {
      console.error("Error aplicando plantilla:", error);

      mostrarMensaje(
        "error",
        `No fue posible aplicar la plantilla a ${equipoSeleccionado.equipo}.`
      );
    } finally {
      setAplicandoId(null);
    }
  };

  // ============================================================
  // FILTRO DEL CATÁLOGO
  // ============================================================

  const catalogoFiltrado = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return catalogo;

    return catalogo.filter((equipo) => {
      return [
        equipo.equipo,
        equipo.marca,
        equipo.modelo,
        equipo.tipo_equipo,
      ]
        .filter(Boolean)
        .some((valor) =>
          String(valor).toLowerCase().includes(texto)
        );
    });
  }, [catalogo, busqueda]);

  // ============================================================
  // LOADING
  // ============================================================

  if (cargando) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2
            size={36}
            className="animate-spin text-blue-600"
          />

          <p className="font-medium">
            Cargando plantilla...
          </p>
        </div>
      </div>
    );
  }

  if (!plantilla) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          No se encontró la plantilla.
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">

        {/* MENSAJE */}

        {mensaje && (
          <div
            className={`fixed right-6 top-6 z-50 flex max-w-md items-center gap-3 rounded-xl border px-5 py-4 shadow-lg ${mensaje.tipo === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
              }`}
          >
            <AlertCircle size={20} />

            <span className="text-sm font-medium">
              {mensaje.texto}
            </span>
          </div>
        )}

        {/* ENCABEZADO */}

        <div className="mb-6">
          <button
            onClick={() => navigate("/plantillas")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Volver a plantillas
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <ClipboardList size={28} />
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Gestión de plantilla
                  </p>

                  <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
                    {plantilla.nombre}
                  </h1>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      Familia:{" "}
                      {plantilla.tipo_equipo || "Sin familia"}
                    </span>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {actividades.length} actividades
                    </span>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      {recomendaciones.length} recomendaciones
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {plantilla.descripcion && (
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-sm leading-6 text-slate-600">
                  {plantilla.descripcion}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ACTIVIDADES Y RECOMENDACIONES */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* ACTIVIDADES */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
                  <Wrench size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    Actividades de mantenimiento
                  </h2>

                  <p className="text-sm text-slate-500">
                    Rutinas que se aplicarán al equipo.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">

              {/* AGREGAR ACTIVIDAD */}

              <div className="mb-6 flex gap-2">
                <textarea
                  value={nuevaActividad}
                  onChange={(e) =>
                    setNuevaActividad(e.target.value)
                  }
                  rows={2}
                  placeholder="Escriba una nueva actividad de mantenimiento..."
                  className="min-h-[72px] flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  onClick={agregarActividad}
                  disabled={
                    guardando || !nuevaActividad.trim()
                  }
                  title="Agregar actividad"
                  className="self-stretch rounded-xl bg-blue-600 px-4 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={22} />
                </button>
              </div>

              {/* LISTADO */}

              <div className="space-y-3">
                {actividades.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center">
                    <Wrench
                      className="mx-auto mb-2 text-slate-300"
                      size={30}
                    />

                    <p className="text-sm text-slate-500">
                      No hay actividades registradas.
                    </p>
                  </div>
                ) : (
                  actividades.map((act) => (
                    <div
                      key={act.id}
                      className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm"
                    >
                      <div className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                          {act.numero_actividad}
                        </div>

                        <div className="min-w-0 flex-1">
                          {actividadEditando === act.id ? (
                            <textarea
                              value={textoActividadEditando}
                              onChange={(e) =>
                                setTextoActividadEditando(
                                  e.target.value
                                )
                              }
                              rows={3}
                              autoFocus
                              className="w-full resize-none rounded-xl border border-blue-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                            />
                          ) : (
                            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                              {act.actividad}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3">
                        {actividadEditando === act.id ? (
                          <>
                            <button
                              onClick={() =>
                                guardarEdicionActividad(act)
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                            >
                              <Check size={15} />
                              Guardar
                            </button>

                            <button
                              onClick={
                                cancelarEdicionActividad
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200"
                            >
                              <X size={15} />
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                iniciarEdicionActividad(act)
                              }
                              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50"
                            >
                              <Pencil size={14} />
                              Editar
                            </button>

                            <button
                              onClick={() =>
                                borrarActividad(act.id)
                              }
                              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* RECOMENDACIONES */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                  <Lightbulb size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    Recomendaciones del fabricante
                  </h2>

                  <p className="text-sm text-slate-500">
                    Indicaciones para uso y conservación.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">

              {/* AGREGAR */}

              <div className="mb-6 flex gap-2">
                <textarea
                  value={nuevaRecomendacion}
                  onChange={(e) =>
                    setNuevaRecomendacion(e.target.value)
                  }
                  rows={2}
                  placeholder="Escriba una recomendación..."
                  className="min-h-[72px] flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

                <button
                  onClick={agregarRecomendacion}
                  disabled={
                    guardando ||
                    !nuevaRecomendacion.trim()
                  }
                  title="Agregar recomendación"
                  className="self-stretch rounded-xl bg-emerald-600 px-4 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={22} />
                </button>
              </div>

              {/* LISTADO */}

              <div className="space-y-3">
                {recomendaciones.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center">
                    <Lightbulb
                      className="mx-auto mb-2 text-slate-300"
                      size={30}
                    />

                    <p className="text-sm text-slate-500">
                      No hay recomendaciones registradas.
                    </p>
                  </div>
                ) : (
                  recomendaciones.map((rec) => (
                    <div
                      key={rec.id}
                      className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:shadow-sm"
                    >
                      <div className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-600">
                          {rec.numero_recomendacion}
                        </div>

                        <div className="min-w-0 flex-1">
                          {recomendacionEditando ===
                            rec.id ? (
                            <textarea
                              value={
                                textoRecomendacionEditando
                              }
                              onChange={(e) =>
                                setTextoRecomendacionEditando(
                                  e.target.value
                                )
                              }
                              rows={3}
                              autoFocus
                              className="w-full resize-none rounded-xl border border-emerald-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-100"
                            />
                          ) : (
                            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                              {rec.recomendacion}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3">
                        {recomendacionEditando ===
                          rec.id ? (
                          <>
                            <button
                              onClick={() =>
                                guardarEdicionRecomendacion(
                                  rec
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                            >
                              <Check size={15} />
                              Guardar
                            </button>

                            <button
                              onClick={
                                cancelarEdicionRecomendacion
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200"
                            >
                              <X size={15} />
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                iniciarEdicionRecomendacion(
                                  rec
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50"
                            >
                              <Pencil size={14} />
                              Editar
                            </button>

                            <button
                              onClick={() =>
                                borrarRecomendacion(rec.id)
                              }
                              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>

        {/* APLICAR AL CATÁLOGO */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-100 p-2 text-violet-600">
                  <PackageCheck size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    Aplicar plantilla a equipos
                  </h2>

                  <p className="text-sm text-slate-500">
                    Selecciona un equipo del catálogo para
                    asignarle estas actividades y
                    recomendaciones.
                  </p>
                </div>
              </div>

              {/* BUSCADOR */}

              <div className="relative w-full lg:w-80">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={busqueda}
                  onChange={(e) =>
                    setBusqueda(e.target.value)
                  }
                  placeholder="Buscar equipo, marca o modelo..."
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* TABLA */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Equipo
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Marca
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Modelo
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Familia
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody>
                {catalogoFiltrado.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      No se encontraron equipos.
                    </td>
                  </tr>
                ) : (
                  catalogoFiltrado.map((equipo) => (
                    <tr
                      key={equipo.id}
                      className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">
                          {equipo.equipo || "-"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {equipo.marca || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {equipo.modelo || "-"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {equipo.tipo_equipo ||
                            "Sin clasificación"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {/* <button
                          onClick={() =>
                            aplicarPlantilla(equipo)
                          }
                          disabled={
                            aplicandoId === equipo.id
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {aplicandoId === equipo.id ? (
                            <>
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                              Aplicando...
                            </>
                          ) : (
                            <>
                              <PackageCheck size={16} />
                              Aplicar
                            </>
                          )}
                        </button> */}
                        <div className="flex items-center justify-end gap-3">
                          {equiposAplicados.includes(equipo.id) && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                              <Check size={14} />
                              Aplicada
                            </span>
                          )}

                          <button
                            onClick={() => abrirModalAplicar(equipo)}
                            disabled={aplicandoId === equipo.id}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <PackageCheck size={16} />

                            {equiposAplicados.includes(equipo.id)
                              ? "Aplicar nuevamente"
                              : "Aplicar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PIE TABLA */}

          <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3">
            <p className="text-xs text-slate-500">
              Mostrando {catalogoFiltrado.length} de{" "}
              {catalogo.length} equipos del catálogo.
            </p>
          </div>
        </section>
      </div>
      {/* MODAL APLICAR PLANTILLA */}

      {mostrarModalAplicar && equipoSeleccionado && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          {/* <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"> */}
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* ENCABEZADO */}

            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <PackageCheck size={22} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Aplicar plantilla
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Selecciona cómo deseas aplicar la información.
                  </p>
                </div>
              </div>

              <button
                onClick={cerrarModalAplicar}
                disabled={Boolean(aplicandoId)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* INFORMACIÓN DEL EQUIPO */}

            <div className="px-6 py-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Equipo seleccionado
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {equipoSeleccionado.equipo}
                </p>

                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
                  <span>
                    Marca:{" "}
                    <strong className="font-medium text-slate-700">
                      {equipoSeleccionado.marca || "No registrada"}
                    </strong>
                  </span>

                  <span>
                    Modelo:{" "}
                    <strong className="font-medium text-slate-700">
                      {equipoSeleccionado.modelo || "No registrado"}
                    </strong>
                  </span>
                </div>
              </div>

              {/* RESUMEN PLANTILLA */}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-2xl font-bold text-blue-700">
                    {actividades.length}
                  </p>

                  <p className="text-xs font-medium text-blue-600">
                    Actividades
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-2xl font-bold text-emerald-700">
                    {recomendaciones.length}
                  </p>

                  <p className="text-xs font-medium text-emerald-600">
                    Recomendaciones
                  </p>
                </div>
              </div>

              {/* OPCIONES */}

              <div className="mt-6 space-y-3">

                {/* REEMPLAZAR */}

                <button
                  onClick={() => confirmarAplicacion(true)}
                  disabled={Boolean(aplicandoId)}
                  className="group flex w-full items-start gap-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-left transition hover:border-amber-300 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <AlertCircle size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      Reemplazar información existente
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Elimina las actividades y recomendaciones actuales del
                      equipo y carga únicamente las de esta plantilla.
                    </p>
                  </div>
                </button>

                {/* AGREGAR */}

                <button
                  onClick={() => confirmarAplicacion(false)}
                  disabled={Boolean(aplicandoId)}
                  className="group flex w-full items-start gap-4 rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Plus size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      Agregar a la información existente
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Conserva las actividades y recomendaciones que ya tiene
                      el equipo y agrega las correspondientes a esta plantilla.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* PIE */}

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
              <p className="text-xs text-slate-400">
                Esta acción modifica el catálogo.
              </p>

              <button
                onClick={cerrarModalAplicar}
                disabled={Boolean(aplicandoId)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>

            {/* OVERLAY DE CARGA */}

            {aplicandoId && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <Loader2
                    size={32}
                    className="animate-spin text-blue-600"
                  />

                  <p className="text-sm font-medium text-slate-600">
                    Aplicando plantilla...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}