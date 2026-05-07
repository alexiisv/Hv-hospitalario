import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { obtenerCatalogo, obtenerCatalogoCompleto } from "../services/catalogoService";
import { crearEquipoInventario } from "../services/inventarioService";
import { useNavigate,  useParams } from "react-router-dom";


export default function CrearInventario() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const navigate = useNavigate();

  const { eseId } = useParams();
  const [catalogo, setCatalogo] = useState([]);
  const [catalogoSeleccionadoId, setCatalogoSeleccionadoId] = useState("");
  const [detalleCatalogo, setDetalleCatalogo] = useState(null);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [equipoSeleccionado, setEquipoSeleccionado] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");

  useEffect(() => {
    cargarCatalogo();
  }, []);

  const cargarCatalogo = async () => {
    try {
      const data = await obtenerCatalogo();
      setCatalogo(data);
    } catch (error) {
      console.error("Error al cargar catálogo:", error);
    } finally {
      setCargandoCatalogo(false);
    }
  };

  const seleccionarCatalogo = async (id) => {
    setCatalogoSeleccionadoId(id);
    setDetalleCatalogo(null);

    if (!id) return;

    try {
      const data = await obtenerCatalogoCompleto(id);
      setDetalleCatalogo(data);
      setValue("catalogo_id", id);
    } catch (error) {
      console.error("Error al obtener detalle del catálogo:", error);
    }
  };

  const equiposUnicos = useMemo(() => {
    return [...new Set(catalogo.map((item) => item.equipo))];
  }, [catalogo]);

  const marcasFiltradas = useMemo(() => {
    if (!equipoSeleccionado) return [];
    return [
      ...new Set(
        catalogo
          .filter((item) => item.equipo === equipoSeleccionado)
          .map((item) => item.marca)
      ),
    ];
  }, [catalogo, equipoSeleccionado]);

  const modelosFiltrados = useMemo(() => {
    if (!equipoSeleccionado || !marcaSeleccionada) return [];
    return catalogo.filter(
      (item) =>
        item.equipo === equipoSeleccionado &&
        item.marca === marcaSeleccionada
    );
  }, [catalogo, equipoSeleccionado, marcaSeleccionada]);

  // const onSubmit = async (data) => {
  //   try {
  //     setGuardando(true);
  //     await crearEquipoInventario({
  //        ...data,
  //        ese_id: eseId,
  //        });
  //     alert("Equipo registrado en inventario correctamente");
  //     reset();
  //     setDetalleCatalogo(null);
  //     setCatalogoSeleccionadoId("");
  //     setEquipoSeleccionado("");
  //     setMarcaSeleccionada("");
  //     // navigate("/inventario");
  //     navigate(eseId ? `/eses/${eseId}/inventario` : "/inventario");
  //   } catch (error) {
  //     console.error("Error al guardar inventario:", error);
  //     alert("Ocurrió un error al guardar el equipo");
  //   } finally {
  //     setGuardando(false);
  //   }
  // };

  const onSubmit = async (data) => {
  try {
    setGuardando(true);

    if (!catalogoSeleccionadoId) {
      alert("Debes seleccionar equipo, marca y modelo");
      return;
    }

    const datosEnviar = {
      ...data,
      catalogo_id: Number(catalogoSeleccionadoId),
      ese_id: eseId ? Number(eseId) : null,
    };

    await crearEquipoInventario(datosEnviar);

    alert("Equipo registrado en inventario correctamente");
    reset();
    setDetalleCatalogo(null);
    setCatalogoSeleccionadoId("");
    setEquipoSeleccionado("");
    setMarcaSeleccionada("");

    navigate(eseId ? `/eses/${eseId}/inventario` : "/inventario");
  } catch (error) {
    console.error("Error al guardar inventario:", error);
    alert("Ocurrió un error al guardar el equipo");
  } finally {
    setGuardando(false);
  }
};
  if (cargandoCatalogo) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <p className="text-slate-600">Cargando catálogo...</p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Registrar equipo en inventario
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Selecciona un equipo del catálogo y completa únicamente los datos variables.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Selección de catálogo
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Equipo</label>
            <select
              value={equipoSeleccionado}
              onChange={(e) => {
                setEquipoSeleccionado(e.target.value);
                setMarcaSeleccionada("");
                setCatalogoSeleccionadoId("");
                setDetalleCatalogo(null);
              }}
              className={inputClass}
            >
              <option value="">Seleccione un equipo</option>
              {equiposUnicos.map((equipo) => (
                <option key={equipo} value={equipo}>
                  {equipo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Marca</label>
            <select
              value={marcaSeleccionada}
              onChange={(e) => {
                setMarcaSeleccionada(e.target.value);
                setCatalogoSeleccionadoId("");
                setDetalleCatalogo(null);
              }}
              className={inputClass}
              disabled={!equipoSeleccionado}
            >
              <option value="">Seleccione una marca</option>
              {marcasFiltradas.map((marca) => (
                <option key={marca} value={marca}>
                  {marca}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Modelo</label>
            <select
              value={catalogoSeleccionadoId}
              onChange={(e) => seleccionarCatalogo(e.target.value)}
              className={inputClass}
              disabled={!marcaSeleccionada}
            >
              <option value="">Seleccione un modelo</option>
              {modelosFiltrados.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.modelo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {detalleCatalogo && (
        <>
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Información autocompletada
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
              <div>
                <div className="rounded-2xl border bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700 mb-3">Imagen del equipo</p>
                  {detalleCatalogo.catalogo.imagen_url ? (
                    <img
                      src={detalleCatalogo.catalogo.imagen_url}
                      alt={detalleCatalogo.catalogo.equipo}
                      className="w-full rounded-xl border bg-white object-cover"
                    />
                  ) : (
                    <div className="rounded-xl border border-dashed bg-white p-6 text-sm text-slate-500">
                      Sin imagen
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3"><strong>Equipo:</strong> {detalleCatalogo.catalogo.equipo}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Marca:</strong> {detalleCatalogo.catalogo.marca}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Modelo:</strong> {detalleCatalogo.catalogo.modelo}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>INVIMA:</strong> {detalleCatalogo.catalogo.invima}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Peso:</strong> {detalleCatalogo.catalogo.peso}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Ancho:</strong> {detalleCatalogo.catalogo.ancho}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Fondo:</strong> {detalleCatalogo.catalogo.fondo}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Alto:</strong> {detalleCatalogo.catalogo.alto}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Resolución:</strong> {detalleCatalogo.catalogo.resolucion}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Capacidad:</strong> {detalleCatalogo.catalogo.capacidad}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Fuente alimentación:</strong> {detalleCatalogo.catalogo.fuente_alimentacion}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Voltaje:</strong> {detalleCatalogo.catalogo.voltaje}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Potencia:</strong> {detalleCatalogo.catalogo.potencia}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Pantalla:</strong> {detalleCatalogo.catalogo.pantalla}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Uso:</strong> {detalleCatalogo.catalogo.uso}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Riesgo:</strong> {detalleCatalogo.catalogo.riesgo}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Clasificación biomédica:</strong> {detalleCatalogo.catalogo.clasificacion_biomedica}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Tecnología:</strong> {detalleCatalogo.catalogo.tecnologia_predominante}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Tipo equipo:</strong> {detalleCatalogo.catalogo.tipo_equipo}</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>Frecuencia mantenimiento:</strong> {detalleCatalogo.catalogo.frecuencia_mantenimiento}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="rounded-2xl bg-slate-50 p-4">
                <h4 className="font-semibold text-slate-800 mb-2">Otras especificaciones</h4>
                <p className="text-sm text-slate-600 whitespace-pre-line">
                  {detalleCatalogo.catalogo.otras_especificaciones || "Sin información"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <h4 className="font-semibold text-slate-800 mb-2">Descripción</h4>
                <p className="text-sm text-slate-600 whitespace-pre-line">
                  {detalleCatalogo.catalogo.descripcion || "Sin información"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Actividades</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-700">
                {detalleCatalogo.actividades.map((item) => (
                  <li key={item.id}>{item.actividad}</li>
                ))}
              </ol>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Recomendaciones</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-700">
                {detalleCatalogo.recomendaciones.map((item) => (
                  <li key={item.id}>{item.recomendacion}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Datos variables del inventario
            </h3>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input type="hidden" {...register("catalogo_id")} />
              <input type="hidden" {...register("imagen_url")} />

              <div>
                <label className={labelClass}>Área</label>
                <input {...register("area")} placeholder="Área" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Ubicación</label>
                <input {...register("ubicacion")} placeholder="Ubicación" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Serie</label>
                <input {...register("serie")} placeholder="Serie" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Fecha de instalación</label>
                <input type="date" {...register("fecha_instalacion")} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Fecha/Año fabricación</label>
                <input {...register("fecha_fabricacion")} placeholder="Fecha o año de fabricación" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Referencia</label>
                <input {...register("referencia")} placeholder="Referencia" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Manual</label>
                <input {...register("manual")} placeholder="Manual" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>País de fabricación</label>
                <input {...register("pais_fabricacion")} placeholder="País de fabricación" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Garantía</label>
                <input {...register("garantia")} placeholder="Garantía" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Forma de adquisición</label>
                <input {...register("forma_adquisicion")} placeholder="Forma de adquisición" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Proveedor</label>
                <input {...register("proveedor")} placeholder="Proveedor" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Código inventario</label>
                <input {...register("codigo_inventario")} placeholder="Código inventario" className={inputClass} />
              </div>

                <div>
                <label className={labelClass}>Imagen del equipo</label>
                <input
                  type="file"
                  className={inputClass}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append("imagen", file);

                    try {
                      const res = await fetch("http://localhost:3001/upload", {
                        method: "POST",
                        body: formData,
                      });

                      const data = await res.json();

                      // 👇 aquí guardamos la URL en el formulario
                      setValue("imagen_url", data.url);
                    } catch (error) {
                      console.error("Error al subir imagen:", error);
                    }
                  }}
                />
              </div>
              
              <div>
                <label className={labelClass}>Estado del equipo</label>
                <input {...register("estado_equipo")} placeholder="Estado del equipo" className={inputClass} />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Observaciones</label>
                <textarea
                  {...register("observaciones")}
                  placeholder="Observaciones"
                  className={`${inputClass} min-h-[100px]`}
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={guardando}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {guardando ? "Guardando..." : "Guardar equipo en inventario"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );

}