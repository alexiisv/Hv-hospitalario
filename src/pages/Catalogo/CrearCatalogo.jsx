import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import { crearCatalogo } from "../../services/catalogoService";

export default function CrearCatalogo() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      imagen_url: "",
      equipo: "",
      marca: "",
      modelo: "",
      codigo_catalogo: "",
      invima: "",
      descripcion: "",
      peso: "",
      ancho: "",
      fondo: "",
      alto: "",
      resolucion: "",
      capacidad: "",
      fuente_alimentacion: "",
      voltaje: "",
      potencia: "",
      pantalla: "",
      otras_especificaciones: "",
      uso: "",
      riesgo: "",
      clasificacion_biomedica: "",
      tecnologia_predominante: "",
      tipo_equipo: "",
      accesorios: "",
    },
  });

  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const imagenUrl = watch("imagen_url");
  const nombreEquipo = watch("equipo");
  const marcaEquipo = watch("marca");
  const modeloEquipo = watch("modelo");

  const inputClass = `
    w-full rounded-xl border border-slate-200 bg-white px-4 py-3
    text-sm text-slate-700 shadow-sm outline-none transition duration-200
    placeholder:text-slate-400 hover:border-slate-300
    focus:border-blue-500 focus:ring-4 focus:ring-blue-100
  `;

  const inputErrorClass = `
    w-full rounded-xl border border-red-400 bg-red-50 px-4 py-3
    text-sm text-slate-700 shadow-sm outline-none transition
    focus:border-red-500 focus:ring-4 focus:ring-red-100
  `;

  const subirImagen = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formatosPermitidos = ["image/jpeg", "image/png", "image/webp"];

    if (!formatosPermitidos.includes(file.type)) {
      setMensaje({
        tipo: "error",
        texto: "La imagen debe estar en formato JPG, PNG o WEBP.",
      });
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMensaje({
        tipo: "error",
        texto: "La imagen no puede superar los 5 MB.",
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
    setValue("imagen_url", "", { shouldDirty: true });
  };

  const autoAjustarTextarea = (event, maxHeight = 220) => {
    const textarea = event.currentTarget;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  const onSubmit = async (data) => {
    try {
      setGuardando(true);
      setMensaje(null);

      await crearCatalogo({
        ...data,
        codigo_catalogo: data.codigo_catalogo?.trim() || null,
        imagen_url: data.imagen_url || null,
      });

      setMensaje({
        tipo: "exito",
        texto: "Equipo creado correctamente en el catálogo.",
      });

      reset();

      setTimeout(() => {
        navigate("/catalogo");
      }, 700);
    } catch (error) {
      console.error("Error al crear catálogo:", error);
      setMensaje({
        tipo: "error",
        texto: "Ocurrió un error al crear el equipo del catálogo.",
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-3xl border border-blue-900/10 bg-gradient-to-r from-slate-950 via-blue-900 to-cyan-700 shadow-xl">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-48 h-36 w-36 rounded-full bg-cyan-300/10 blur-2xl" />

          <div className="relative flex flex-col gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
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
                    Crear nuevo equipo
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                    Registre la información base que se reutilizará en los inventarios de las ESEs.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-200">
                Vista rápida
              </p>
              <p className="mt-1 max-w-sm truncate text-lg font-bold text-white">
                {nombreEquipo || "Nuevo equipo biomédico"}
              </p>
              <p className="mt-1 text-sm text-blue-100">
                {[marcaEquipo, modeloEquipo].filter(Boolean).join(" · ") ||
                  "Complete marca y modelo"}
              </p>
            </div>
          </div>
        </header>

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input type="hidden" {...register("imagen_url")} />

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={Box}
              title="Identificación del equipo"
              description="Información principal para reconocer el modelo dentro del catálogo."
            />

            <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  <FormField label="Nombre del equipo" required error={errors.equipo}>
                    <input
                      {...register("equipo", {
                        required: "El nombre del equipo es obligatorio.",
                      })}
                      className={errors.equipo ? inputErrorClass : inputClass}
                      placeholder="Ej. Tensiómetro adulto"
                    />
                  </FormField>

                  <FormField label="Marca" required error={errors.marca}>
                    <input
                      {...register("marca", {
                        required: "La marca es obligatoria.",
                      })}
                      className={errors.marca ? inputErrorClass : inputClass}
                      placeholder="Ej. ALPK2"
                    />
                  </FormField>

                  <FormField label="Modelo" required error={errors.modelo}>
                    <input
                      {...register("modelo", {
                        required: "El modelo es obligatorio.",
                      })}
                      className={errors.modelo ? inputErrorClass : inputClass}
                      placeholder="Ej. 500-V"
                    />
                  </FormField>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-cyan-50/50 p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        Descripción del equipo
                      </h3>
                      <p className="text-xs text-slate-500">
                        Resuma su función principal y aplicación.
                      </p>
                    </div>
                  </div>

                  <textarea
                    {...register("descripcion")}
                    rows={2}
                    onInput={(event) => autoAjustarTextarea(event, 220)}
                    className={`${inputClass} min-h-[72px] resize-none overflow-hidden bg-white`}
                    placeholder="Ej. Equipo utilizado para medir la presión arterial de forma no invasiva..."
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField label="Código del catálogo">
                    <input
                      {...register("codigo_catalogo")}
                      className={inputClass}
                      placeholder="Ej. TENS-ALPK2-500V"
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

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Camera size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Imagen del equipo
                    </h3>
                    <p className="text-xs text-slate-500">JPG, PNG o WEBP</p>
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
                        <ImageIcon size={28} className="text-slate-400" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-600">
                        Sin imagen seleccionada
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Agregue una fotografía del equipo.
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

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={Ruler}
              title="Características técnicas"
              description="Dimensiones, alimentación y especificaciones funcionales del equipo."
            />

            <div className="space-y-8 p-6 lg:p-8">
              <SubsectionTitle icon={Ruler} title="Dimensiones y capacidad" />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <FormField label="Peso">
                  <input {...register("peso")} className={inputClass} placeholder="Ej. 0.5 kg" />
                </FormField>
                <FormField label="Ancho">
                  <input {...register("ancho")} className={inputClass} placeholder="Ej. 25 cm" />
                </FormField>
                <FormField label="Fondo">
                  <input {...register("fondo")} className={inputClass} placeholder="Ej. 18 cm" />
                </FormField>
                <FormField label="Alto">
                  <input {...register("alto")} className={inputClass} placeholder="Ej. 30 cm" />
                </FormField>
                <FormField label="Capacidad">
                  <input {...register("capacidad")} className={inputClass} placeholder="Ej. 200 kg" />
                </FormField>
                <FormField label="Resolución">
                  <input {...register("resolucion")} className={inputClass} placeholder="Ej. 1 mmHg" />
                </FormField>
                <FormField label="Pantalla">
                  <input {...register("pantalla")} className={inputClass} placeholder="Ej. LCD" />
                </FormField>
              </div>

              <div className="border-t border-slate-100" />

              <SubsectionTitle icon={Zap} title="Alimentación eléctrica" />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <FormField label="Fuente de alimentación">
                  <input
                    {...register("fuente_alimentacion")}
                    className={inputClass}
                    placeholder="Ej. Manual / batería"
                  />
                </FormField>
                <FormField label="Voltaje">
                  <input {...register("voltaje")} className={inputClass} placeholder="Ej. 110 V AC" />
                </FormField>
                <FormField label="Potencia">
                  <input {...register("potencia")} className={inputClass} placeholder="Ej. 250 W" />
                </FormField>
              </div>

              <FormField label="Otras especificaciones">
                <textarea
                  {...register("otras_especificaciones")}
                  rows={2}
                  onInput={(event) => autoAjustarTextarea(event, 260)}
                  className={`${inputClass} min-h-[72px] resize-none overflow-hidden`}
                  placeholder="Registre características técnicas adicionales..."
                />
              </FormField>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={ShieldCheck}
              title="Clasificación biomédica"
              description="Información de uso, riesgo, tecnología y tipo de dispositivo."
            />

            <div className="space-y-6 p-6 lg:p-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <FormField label="Uso">
                  <select {...register("uso")} className={inputClass}>
                    <option value="">Seleccione...</option>
                    <option value="MEDICO">Médico</option>
                    <option value="BASICO">Básico</option>
                    <option value="APOYO">Apoyo</option>
                  </select>
                </FormField>

                <FormField label="Riesgo">
                  <select {...register("riesgo")} className={inputClass}>
                    <option value="">Seleccione...</option>
                    <option value="I">Clase I</option>
                    <option value="IIA">Clase IIA</option>
                    <option value="IIB">Clase IIB</option>
                    <option value="III">Clase III</option>
                  </select>
                </FormField>

                <FormField label="Clasificación biomédica">
                  <select
                    {...register("clasificacion_biomedica")}
                    className={inputClass}
                  >
                    <option value="">Seleccione...</option>
                    <option value="DIAGNÓSTICO">
                      Diagnóstico
                    </option>
                    <option value="TRATAMIENTO Y MANTENIMIENTO DE LA VIDA">
                      Tratamiento y Mantenimiento de la vida
                    </option>
                    <option value="PREVENCION">
                      Prevención
                    </option>
                    <option value="REHABILITACION">
                      Rehabilitación
                    </option>
                    <option value="ANALISIS DE LABORATORIO">
                      Análisis de Laboratorio
                    </option>
                    <option value="OTRO">
                      Otro
                    </option>

                  </select>
                </FormField>

                <FormField label="Tecnología predominante">
                  <select
                    {...register("tecnologia_predominante")}
                    className={inputClass}
                  >
                    <option value="">Seleccione...</option>
                    <option value="MECÁNICA">Mecánica</option>
                    <option value="ELÉCTRICA">Eléctrica</option>
                    <option value="ELECTRÓNICA">Electrónica</option>
                    <option value="NEUMÁTICA">Neumática</option>
                    <option value="HIDRÁULICA">Hidráulica</option>
                    <option value="ÓPTICA">Óptica</option>
                  </select>
                </FormField>

                <FormField label="Tipo de equipo">
                  <select
                    {...register("tipo_equipo")}
                    className={inputClass}
                  >
                    <option value="">Seleccione...</option>
                    <option value="FIJO">Fijo</option>
                    <option value="PORTÁTIL">Portátil</option>
                    <option value="MÓVIL">Móvil</option>
                    <option value="DE MESA">De mesa</option>
                  </select>
                </FormField> 
              </div>

              <FormField label="Accesorios">
                <textarea
                  {...register("accesorios")}
                  rows={3}
                  onInput={(event) => autoAjustarTextarea(event, 260)}
                  className={`${inputClass} min-h-[92px] resize-none overflow-hidden`}
                  placeholder={
                    "Registre un accesorio por línea.\nEj. Brazalete adulto\nCable de poder\nSensor SpO₂"
                  }
                />
              </FormField>
            </div>
          </section>

          <div className="sticky bottom-4 z-20">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDirty
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-500"
                    }`}
                >
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {isDirty ? "Formulario en edición" : "Complete la información"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Los campos marcados con * son obligatorios.
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
                      Guardar equipo
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
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
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
        {required && <span className="ml-1 text-red-500">*</span>}
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