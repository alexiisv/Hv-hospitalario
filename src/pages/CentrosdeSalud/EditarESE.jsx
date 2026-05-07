import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { actualizarEse, obtenerEsePorId } from "../../services/eseService";

export default function EditarESE() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const logoUrl = watch("logo_url");

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  useEffect(() => {
    cargarEse();
  }, [id]);

  const cargarEse = async () => {
    try {
      const data = await obtenerEsePorId(id);
      reset(data);
    } catch (error) {
      console.error("Error al cargar ESE:", error);
      alert("No se pudo cargar la ESE");
    } finally {
      setCargando(false);
    }
  };

  const subirLogo = async (e) => {
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
      setValue("logo_url", data.url);
    } catch (error) {
      console.error("Error al subir logo:", error);
      alert("No se pudo subir el logo");
    }
  };

  const onSubmit = async (data) => {
    try {
      setGuardando(true);

      await actualizarEse(id, {
        ...data,
        logo_url: data.logo_url || null,
      });

      alert("ESE actualizada correctamente");
      navigate("/eses");
    } catch (error) {
      console.error("Error al actualizar ESE:", error);
      alert("Ocurrió un error al actualizar la ESE");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <p className="text-slate-600">Cargando ESE...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-slate-800">Editar ESE</h2>
        <p className="text-sm text-slate-500 mt-1">
          Modifica la información institucional.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-sm border p-6 space-y-6"
      >
        <input type="hidden" {...register("logo_url")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Nombre de la ESE *</label>
            <input
              {...register("nombre", { required: true })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>NIT</label>
            <input {...register("nit")} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Teléfono</label>
            <input {...register("telefono")} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Dirección</label>
            <input {...register("direccion")} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input type="email" {...register("email")} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Ciudad</label>
            <input {...register("ciudad")} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Departamento</label>
            <input {...register("departamento")} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Estado</label>
            <select {...register("estado")} className={inputClass}>
              <option value="ACTIVA">ACTIVA</option>
              <option value="INACTIVA">INACTIVA</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Cambiar logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={subirLogo}
              className={inputClass}
            />
          </div>

          {logoUrl && (
            <div className="md:col-span-2">
              <div className="rounded-2xl border bg-slate-50 p-4 w-fit">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Logo actual
                </p>
                <img
                  src={logoUrl}
                  alt="Logo ESE"
                  className="w-40 h-40 object-contain rounded-xl bg-white border"
                />
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <label className={labelClass}>Observaciones</label>
            <textarea
              {...register("observaciones")}
              className={`${inputClass} min-h-[100px]`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <button
            type="button"
            onClick={() => navigate("/eses")}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={guardando}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Actualizar ESE"}
          </button>
        </div>
      </form>
    </div>
  );
}