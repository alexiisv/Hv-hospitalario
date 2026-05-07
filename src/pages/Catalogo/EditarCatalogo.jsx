import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerCatalogoPorId, actualizarCatalogo } from "../../services/catalogoService";

export default function EditarCatalogo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const imagenUrl = watch("imagen_url");

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  useEffect(() => {
    cargarCatalogo();
  }, [id]);

  const cargarCatalogo = async () => {
    try {
      const data = await obtenerCatalogoPorId(id);
      reset(data);
    } catch (error) {
      console.error("Error al cargar catálogo:", error);
      alert("No se pudo cargar el equipo del catálogo");
    } finally {
      setCargando(false);
    }
  };

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

      await actualizarCatalogo(id, {
        ...data,
        codigo_catalogo: data.codigo_catalogo || null,
        imagen_url: data.imagen_url || null,
      });

      alert("Catálogo actualizado correctamente");
      navigate("/catalogo");
    } catch (error) {
      console.error("Error al actualizar catálogo:", error);
      alert("Ocurrió un error al actualizar el catálogo");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <p className="text-slate-600">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Editar equipo del catálogo
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Modifica la información base del modelo biomédico.
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
              />
            </div>

            <div>
              <label className={labelClass}>Marca *</label>
              <input
                {...register("marca", { required: true })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Modelo *</label>
              <input
                {...register("modelo", { required: true })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Código catálogo</label>
              <input {...register("codigo_catalogo")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>INVIMA</label>
              <input {...register("invima")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Cambiar imagen</label>
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
                Imagen actual
              </p>
              <img
                src={imagenUrl}
                alt="Imagen catálogo"
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
              <input {...register("peso")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Ancho</label>
              <input {...register("ancho")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Fondo</label>
              <input {...register("fondo")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Alto</label>
              <input {...register("alto")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Resolución</label>
              <input {...register("resolucion")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Capacidad</label>
              <input {...register("capacidad")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Fuente alimentación</label>
              <input {...register("fuente_alimentacion")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Voltaje</label>
              <input {...register("voltaje")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Potencia</label>
              <input {...register("potencia")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Pantalla</label>
              <input {...register("pantalla")} className={inputClass} />
            </div>

            <div className="md:col-span-3">
              <label className={labelClass}>Otras especificaciones</label>
              <textarea
                {...register("otras_especificaciones")}
                className={`${inputClass} min-h-[100px]`}
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
              <input {...register("uso")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Riesgo</label>
              <input {...register("riesgo")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Clasificación biomédica</label>
              <input {...register("clasificacion_biomedica")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Tecnología predominante</label>
              <input {...register("tecnologia_predominante")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Tipo equipo</label>
              <input {...register("tipo_equipo")} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Frecuencia mantenimiento</label>
              <input {...register("frecuencia_mantenimiento")} className={inputClass} />
            </div>

            <div className="md:col-span-3">
              <label className={labelClass}>Descripción</label>
              <textarea
                {...register("descripcion")}
                className={`${inputClass} min-h-[100px]`}
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
            {guardando ? "Guardando..." : "Actualizar catálogo"}
          </button>
        </div>
      </form>
    </div>
  );
}