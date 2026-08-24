import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Box,
  Camera,
  CheckCircle2,
  FileText,
  ImageIcon,
  Loader2,
  Ruler,
  Save,
  ShieldCheck,
  Stethoscope,
  UploadCloud,
  X,
  Zap,
} from "lucide-react";

import {
  obtenerCatalogoPorId,
  actualizarCatalogo,
} from "../../services/catalogoService";

export default function EditarCatalogo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm();

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const imagenUrl = watch("imagen_url");
  const nombreEquipo = watch("equipo");
  const marcaEquipo = watch("marca");
  const modeloEquipo = watch("modelo");

  const inputClass = `
    w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700
    shadow-sm outline-none transition duration-200
    placeholder:text-slate-400
    focus:border-blue-500 focus:ring-4 focus:ring-blue-100
  `;

  const inputErrorClass = `
    w-full rounded-xl border border-red-400 bg-red-50 px-4 py-3
    text-sm text-slate-700 shadow-sm outline-none transition
    focus:border-red-500 focus:ring-4 focus:ring-red-100
  `;

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  useEffect(() => {
    cargarCatalogo();
  }, [id]);

  const cargarCatalogo = async () => {
    try {
      setCargando(true);
      setMensaje(null);

      const data = await obtenerCatalogoPorId(id);

      reset({
        equipo: data.equipo || "",
        marca: data.marca || "",
        modelo: data.modelo || "",
        codigo_catalogo: data.codigo_catalogo || "",
        invima: data.invima || "",
        imagen_url: data.imagen_url || "",

        peso: data.peso || "",
        ancho: data.ancho || "",
        fondo: data.fondo || "",
        alto: data.alto || "",
        resolucion: data.resolucion || "",
        capacidad: data.capacidad || "",
        fuente_alimentacion: data.fuente_alimentacion || "",
        voltaje: data.voltaje || "",
        potencia: data.potencia || "",
        pantalla: data.pantalla || "",
        otras_especificaciones: data.otras_especificaciones || "",

        uso: data.uso || "",
        riesgo: data.riesgo || "",
        clasificacion_biomedica:
          data.clasificacion_biomedica || "",
        tecnologia_predominante:
          data.tecnologia_predominante || "",
        tipo_equipo: data.tipo_equipo || "",
        accesorios: data.accesorios || "",
        descripcion: data.descripcion || "",
      });
    } catch (error) {
      console.error("Error al cargar catálogo:", error);

      setMensaje({
        tipo: "error",
        texto: "No se pudo cargar la información del equipo.",
      });
    } finally {
      setCargando(false);
    }
  };

  const subirImagen = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const formatosPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!formatosPermitidos.includes(file.type)) {
      setMensaje({
        tipo: "error",
        texto: "La imagen debe estar en formato JPG, PNG o WEBP.",
      });

      event.target.value = "";
      return;
    }

    const limiteMb = 5;
    const limiteBytes = limiteMb * 1024 * 1024;

    if (file.size > limiteBytes) {
      setMensaje({
        tipo: "error",
        texto: `La imagen no puede superar los ${limiteMb} MB.`,
      });

      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("imagen", file);

    try {
      setSubiendoImagen(true);
      setMensaje(null);

      const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("No se pudo subir la imagen");
      }

      const data = await response.json();

      setValue("imagen_url", data.url, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setMensaje({
        tipo: "exito",
        texto: "Imagen cargada correctamente.",
      });
    } catch (error) {
      console.error("Error al subir imagen:", error);

      setMensaje({
        tipo: "error",
        texto: "No se pudo subir la imagen seleccionada.",
      });
    } finally {
      setSubiendoImagen(false);
      event.target.value = "";
    }
  };

  const eliminarImagen = () => {
    setValue("imagen_url", "", {
      shouldDirty: true,
    });

    setMensaje({
      tipo: "exito",
      texto: "La imagen fue retirada del formulario.",
    });
  };

  const onSubmit = async (data) => {
    try {
      setGuardando(true);
      setMensaje(null);

      await actualizarCatalogo(id, {
        ...data,
        codigo_catalogo: data.codigo_catalogo?.trim() || null,
        imagen_url: data.imagen_url || null,
      });

      setMensaje({
        tipo: "exito",
        texto: "El catálogo se actualizó correctamente.",
      });

      setTimeout(() => {
        navigate("/catalogo");
      }, 800);
    } catch (error) {
      console.error("Error al actualizar catálogo:", error);

      setMensaje({
        tipo: "error",
        texto: "Ocurrió un error al actualizar el catálogo.",
      });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center rounded-3xl border border-slate-200 bg-white px-10 py-8 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800">
            Cargando equipo
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Consultando la información del catálogo...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="overflow-hidden rounded-3xl border border-blue-900/10 bg-gradient-to-r from-slate-950 via-blue-900 to-cyan-700 shadow-xl">
          <div className="relative px-6 py-8 sm:px-8">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-40 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => navigate("/catalogo")}
                  className="mb-5 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  <ArrowLeft size={17} />
                  Volver al catálogo
                </button>

                <div className="flex items-start gap-4">
                  <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm sm:flex">
                    <Stethoscope size={28} className="text-white" />
                  </div>

                  <div>
                    <p className="mb-1 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
                      Catálogo biomédico
                    </p>

                    <h1 className="text-2xl font-bold text-white sm:text-3xl">
                      Editar equipo
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                      Actualice la identificación, características técnicas y
                      clasificación del modelo biomédico.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-200">
                  Equipo seleccionado
                </p>

                <p className="mt-1 max-w-sm truncate text-lg font-bold text-white">
                  {nombreEquipo || "Equipo biomédico"}
                </p>

                <p className="mt-1 text-sm text-blue-100">
                  {[marcaEquipo, modeloEquipo]
                    .filter(Boolean)
                    .join(" · ") || "Sin marca o modelo registrado"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div
            className={`flex items-start justify-between gap-4 rounded-2xl border px-5 py-4 shadow-sm ${mensaje.tipo === "exito"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
              }`}
          >
            <div className="flex items-start gap-3">
              {mensaje.tipo === "exito" ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              ) : (
                <X className="mt-0.5 h-5 w-5 shrink-0" />
              )}

              <p className="text-sm font-medium">{mensaje.texto}</p>
            </div>

            <button
              type="button"
              onClick={() => setMensaje(null)}
              className="rounded-lg p-1 transition hover:bg-black/5"
              aria-label="Cerrar mensaje"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <input type="hidden" {...register("imagen_url")} />

          {/* Identificación */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={Box}
              title="Identificación del equipo"
              description="Información principal con la que se identifica el modelo dentro del catálogo."
            />

            <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-8">
              <div className="space-y-6">
                {/* Datos principales */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  <FormField
                    label="Nombre del equipo"
                    required
                    error={errors.equipo}
                  >
                    <input
                      {...register("equipo", {
                        required: "El nombre del equipo es obligatorio.",
                      })}
                      className={errors.equipo ? inputErrorClass : inputClass}
                      placeholder="Ej. Monitor multiparámetro"
                    />
                  </FormField>

                  <FormField
                    label="Marca"
                    required
                    error={errors.marca}
                  >
                    <input
                      {...register("marca", {
                        required: "La marca es obligatoria.",
                      })}
                      className={errors.marca ? inputErrorClass : inputClass}
                      placeholder="Ej. Mindray"
                    />
                  </FormField>

                  <FormField
                    label="Modelo"
                    required
                    error={errors.modelo}
                  >
                    <input
                      {...register("modelo", {
                        required: "El modelo es obligatorio.",
                      })}
                      className={errors.modelo ? inputErrorClass : inputClass}
                      placeholder="Ej. PM-8000"
                    />
                  </FormField>
                </div>

                {/* Descripción principal */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <FileText size={18} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        Descripción del equipo
                      </h3>

                      <p className="text-xs text-slate-500">
                        Registre la función principal y el uso general del equipo.
                      </p>
                    </div>
                  </div>

                  <textarea
                    {...register("descripcion")}
                    rows={2}
                    className={`${inputClass} resize-none overflow-hidden`}
                    placeholder="Descripción general del equipo..."
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  />
                </div>

                {/* Información complementaria */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField label="Código del catálogo">
                    <input
                      {...register("codigo_catalogo")}
                      className={inputClass}
                      placeholder="Ej. CAT-BIO-001"
                    />
                  </FormField>

                  <FormField label="Registro INVIMA">
                    <input
                      {...register("invima")}
                      className={inputClass}
                      placeholder="Número o referencia INVIMA"
                    />
                  </FormField>
                </div>
              </div>

              {/* Tarjeta de imagen */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Camera size={20} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Imagen del equipo
                    </h3>

                    <p className="text-xs text-slate-500">
                      JPG, PNG o WEBP
                    </p>
                  </div>
                </div>

                <div className="group relative flex h-56 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white">
                  {imagenUrl ? (
                    <>
                      <img
                        src={imagenUrl}
                        alt={`Imagen de ${nombreEquipo || "equipo"}`}
                        className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-[1.02]"
                      />

                      <button
                        type="button"
                        onClick={eliminarImagen}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-red-600 shadow-md transition hover:bg-red-50"
                        title="Quitar imagen"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center px-4 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                        <ImageIcon
                          size={28}
                          className="text-slate-400"
                        />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-600">
                        Sin imagen registrada
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Seleccione una imagen del equipo.
                      </p>
                    </div>
                  )}

                  {subiendoImagen && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        Subiendo imagen...
                      </p>
                    </div>
                  )}
                </div>

                <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                  <UploadCloud size={18} />

                  {imagenUrl ? "Cambiar imagen" : "Seleccionar imagen"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={subirImagen}
                    disabled={subiendoImagen}
                    className="hidden"
                  />
                </label>

                <p className="mt-3 text-center text-xs text-slate-400">
                  Tamaño máximo recomendado: 5 MB
                </p>
              </div>
            </div>
          </section>

          {/* Características técnicas */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={Ruler}
              title="Características técnicas"
              description="Dimensiones, alimentación eléctrica y especificaciones funcionales."
            />

            <div className="space-y-8 p-6 lg:p-8">
              <SubsectionTitle
                icon={Ruler}
                title="Dimensiones y capacidad"
              />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <FormField label="Peso">
                  <input
                    {...register("peso")}
                    className={inputClass}
                    placeholder="Ej. 12 kg"
                  />
                </FormField>

                <FormField label="Ancho">
                  <input
                    {...register("ancho")}
                    className={inputClass}
                    placeholder="Ej. 45 cm"
                  />
                </FormField>

                <FormField label="Fondo">
                  <input
                    {...register("fondo")}
                    className={inputClass}
                    placeholder="Ej. 38 cm"
                  />
                </FormField>

                <FormField label="Alto">
                  <input
                    {...register("alto")}
                    className={inputClass}
                    placeholder="Ej. 60 cm"
                  />
                </FormField>

                <FormField label="Capacidad">
                  <input
                    {...register("capacidad")}
                    className={inputClass}
                    placeholder="Capacidad del equipo"
                  />
                </FormField>

                <FormField label="Resolución">
                  <input
                    {...register("resolucion")}
                    className={inputClass}
                    placeholder="Resolución o precisión"
                  />
                </FormField>

                <FormField label="Pantalla">
                  <input
                    {...register("pantalla")}
                    className={inputClass}
                    placeholder="Tipo o tamaño de pantalla"
                  />
                </FormField>
              </div>

              <div className="border-t border-slate-100" />

              <SubsectionTitle
                icon={Zap}
                title="Alimentación eléctrica"
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <FormField label="Fuente de alimentación">
                  <input
                    {...register("fuente_alimentacion")}
                    className={inputClass}
                    placeholder="Ej. Corriente alterna / batería"
                  />
                </FormField>

                <FormField label="Voltaje">
                  <input
                    {...register("voltaje")}
                    className={inputClass}
                    placeholder="Ej. 110 V AC"
                  />
                </FormField>

                <FormField label="Potencia">
                  <input
                    {...register("potencia")}
                    className={inputClass}
                    placeholder="Ej. 250 W"
                  />
                </FormField>
              </div>

              <FormField label="Otras especificaciones">
                <textarea
                  {...register("otras_especificaciones")}
                  rows={5}
                  className={`${inputClass} resize-y`}
                  placeholder="Registre características técnicas adicionales del equipo..."
                />
              </FormField>
            </div>
          </section>

          {/* Clasificación */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={ShieldCheck}
              title="Clasificación biomédica"
              description="Información de uso, riesgo, tecnología y categoría del dispositivo."
            />

            <div className="space-y-6 p-6 lg:p-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {/* <FormField label="Uso">
                  <select
                    {...register("uso")}
                    className={inputClass}
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="DIAGNÓSTICO">Diagnóstico</option>
                    <option value="TRATAMIENTO">Tratamiento</option>
                    <option value="REHABILITACIÓN">Rehabilitación</option>
                    <option value="PREVENCIÓN">Prevención</option>
                    <option value="SOPORTE VITAL">Soporte vital</option>
                    <option value="LABORATORIO">Laboratorio</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </FormField> */}
                <FormField label="Uso">
                  <input
                    {...register("uso")}
                    className={inputClass}
                    placeholder="Ej. Diagnóstico, tratamiento o soporte vital"
                  />
                </FormField>

                <FormField label="Riesgo">
                  <select
                    {...register("riesgo")}
                    className={inputClass}
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="I">Clase I</option>
                    <option value="IIA">Clase IIA</option>
                    <option value="IIB">Clase IIB</option>
                    <option value="III">Clase III</option>
                  </select>
                </FormField>

                <FormField label="Clasificación biomédica">
                  <input
                    {...register("clasificacion_biomedica")}
                    className={inputClass}
                    placeholder="Clasificación del equipo"
                  />
                </FormField>

                <FormField label="Tecnología predominante">
                  <input
                    {...register("tecnologia_predominante")}
                    className={inputClass}
                    placeholder="Ej. Electrónica, mecánica o electromecánica"
                  />
                </FormField>

                <FormField label="Tipo de equipo">
                  <input
                    {...register("tipo_equipo")}
                    className={inputClass}
                    placeholder="Ej. Equipo biomédico"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <FormField label="Accesorios">
                  <textarea
                    {...register("accesorios")}
                    rows={6}
                    className={`${inputClass} resize-y`}
                    placeholder={
                      "Registre un accesorio por línea.\nEj. Cable de alimentación\nSensor SpO₂\nBrazalete adulto"
                    }
                  />
                </FormField>

              
              </div>
            </div>
          </section>

          {/* Barra inferior */}
          <div className="sticky bottom-4 z-20">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDirty
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                    }`}
                >
                  <FileText size={20} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {isDirty
                      ? "Hay cambios sin guardar"
                      : "Información actualizada"}
                  </p>

                  <p className="text-xs text-slate-500">
                    Revise la información antes de continuar.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/catalogo")}
                  disabled={guardando}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X size={18} />
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando || subiendoImagen}
                  className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {guardando ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Guardar cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5 lg:px-8">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
          <Icon size={22} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function SubsectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        <Icon size={18} />
      </div>

      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
        {title}
      </h3>
    </div>
  );
}

function FormField({ label, required, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
}