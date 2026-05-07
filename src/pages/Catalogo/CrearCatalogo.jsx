import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { crearCatalogo } from "../../services/catalogoService";

export default function CrearCatalogo() {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const navigate = useNavigate();
  const [guardando, setGuardando] = useState(false);

  const imagenUrl = watch("imagen_url");

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  const subirImagen = async (e) => {
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
      setValue("imagen_url", data.url);
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert("No se pudo subir la imagen");
    }
  };

  const onSubmit = async (data) => {
    try {
      setGuardando(true);

      await crearCatalogo({
        ...data,
        codigo_catalogo: data.codigo_catalogo || null,
        imagen_url: data.imagen_url || null,
      });

      alert("Equipo creado en catálogo correctamente");
      reset();
      navigate("/catalogo");
    } catch (error) {
      console.error("Error al crear catálogo:", error);
      alert("Ocurrió un error al crear el equipo del catálogo");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Crear equipo en catálogo
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Registra aquí el modelo base del equipo biomédico. Esta información se reutilizará en las ESEs.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-sm border p-6 space-y-8"
      >
        <input type="hidden" {...register("imagen_url")} />

        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Identificación del equipo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Equipo *</label>
              <input
                {...register("equipo", { required: true })}
                className={inputClass}
                placeholder="Ej: TENSIÓMETRO ADULTO"
              />
            </div>

            <div>
              <label className={labelClass}>Marca *</label>
              <input
                {...register("marca", { required: true })}
                className={inputClass}
                placeholder="Ej: ALPK2"
              />
            </div>

            <div>
              <label className={labelClass}>Modelo *</label>
              <input
                {...register("modelo", { required: true })}
                className={inputClass}
                placeholder="Ej: 500-V"
              />
            </div>

            <div>
              <label className={labelClass}>Código catálogo</label>
              <input
                {...register("codigo_catalogo")}
                className={inputClass}
                placeholder="Ej: TENS-ALPK2-500V"
              />
            </div>

            <div>
              <label className={labelClass}>INVIMA</label>
              <input
                {...register("invima")}
                className={inputClass}
                placeholder="Registro INVIMA"
              />
            </div>

            <div>
              <label className={labelClass}>Imagen del equipo</label>
              <input
                type="file"
                accept="image/*"
                onChange={subirImagen}
                className={inputClass}
              />
            </div>
          </div>

          {imagenUrl && (
            <div className="mt-4 rounded-2xl border bg-slate-50 p-4 w-fit">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Vista previa
              </p>
              <img
                src={imagenUrl}
                alt="Vista previa"
                className="w-40 h-40 object-contain rounded-xl bg-white border"
              />
            </div>
          )}
        </section>

        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Características técnicas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Peso</label>
              <input {...register("peso")} className={inputClass} placeholder="Ej: 0.5 KG" />
            </div>

            <div>
              <label className={labelClass}>Ancho</label>
              <input {...register("ancho")} className={inputClass} placeholder="Ej: NA" />
            </div>

            <div>
              <label className={labelClass}>Fondo</label>
              <input {...register("fondo")} className={inputClass} placeholder="Ej: NA" />
            </div>

            <div>
              <label className={labelClass}>Alto</label>
              <input {...register("alto")} className={inputClass} placeholder="Ej: NA" />
            </div>

            <div>
              <label className={labelClass}>Resolución</label>
              <input {...register("resolucion")} className={inputClass} placeholder="Ej: 20-1000 HZ" />
            </div>

            <div>
              <label className={labelClass}>Capacidad</label>
              <input {...register("capacidad")} className={inputClass} placeholder="Ej: NA" />
            </div>

            <div>
              <label className={labelClass}>Fuente alimentación</label>
              <input {...register("fuente_alimentacion")} className={inputClass} placeholder="Ej: Manual / Batería" />
            </div>

            <div>
              <label className={labelClass}>Voltaje</label>
              <input {...register("voltaje")} className={inputClass} placeholder="Ej: 110V / NA" />
            </div>

            <div>
              <label className={labelClass}>Potencia</label>
              <input {...register("potencia")} className={inputClass} placeholder="Ej: NA" />
            </div>

            <div>
              <label className={labelClass}>Pantalla</label>
              <input {...register("pantalla")} className={inputClass} placeholder="Ej: LED / NA" />
            </div>

            <div className="md:col-span-3">
              <label className={labelClass}>Otras especificaciones</label>
              <textarea
                {...register("otras_especificaciones")}
                className={`${inputClass} min-h-[100px]`}
                placeholder="Describe características técnicas adicionales"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Clasificación biomédica
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Uso</label>
              <input {...register("uso")} className={inputClass} placeholder="Ej: MÉDICO" />
            </div>

            <div>
              <label className={labelClass}>Riesgo</label>
              <input {...register("riesgo")} className={inputClass} placeholder="Ej: I / IIA / IIB / III" />
            </div>

            <div>
              <label className={labelClass}>Clasificación biomédica</label>
              <input {...register("clasificacion_biomedica")} className={inputClass} placeholder="Ej: DIAGNÓSTICO" />
            </div>

            <div>
              <label className={labelClass}>Tecnología predominante</label>
              <input {...register("tecnologia_predominante")} className={inputClass} placeholder="Ej: NEUMÁTICA" />
            </div>

            <div>
              <label className={labelClass}>Tipo equipo</label>
              <input {...register("tipo_equipo")} className={inputClass} placeholder="Ej: MÓVIL / FIJO / PORTÁTIL" />
            </div>

            <div>
              <label className={labelClass}>Frecuencia mantenimiento</label>
              <input {...register("frecuencia_mantenimiento")} className={inputClass} placeholder="Ej: 4 MESES" />
            </div>

            <div className="md:col-span-3">
              <label className={labelClass}>Descripción</label>
              <textarea
                {...register("descripcion")}
                className={`${inputClass} min-h-[100px]`}
                placeholder="Descripción general del equipo"
              />
            </div>
          </div>
        </section>

        <div className="flex gap-3 justify-end border-t pt-6">
          <button
            type="button"
            onClick={() => navigate("/catalogo")}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={guardando}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Guardar catálogo"}
          </button>
        </div>
      </form>
    </div>
  );
}