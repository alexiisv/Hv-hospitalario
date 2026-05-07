import { useForm } from "react-hook-form";
import { crearEquipo } from "../services/equipoService";
import { useNavigate } from "react-router-dom";

export default function CrearEquipo() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await crearEquipo(data);
      alert("Equipo registrado correctamente");
      reset();
      navigate("/equipos");
    } catch (error) {
      console.error("Error al crear equipo:", error);
      alert("Ocurrió un error al guardar el equipo");
    }
  };

  return (
    <div>
      <h1>Registrar nuevo equipo biomédico</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
          maxWidth: "1000px",
        }}
      >
        <input {...register("area")} placeholder="Área" />
        <input {...register("ubicacion")} placeholder="Ubicación" />
        <input {...register("equipo")} placeholder="Equipo" required />
        <input {...register("marca")} placeholder="Marca" />
        <input {...register("modelo")} placeholder="Modelo" />
        <input {...register("serie")} placeholder="Serie" />
        <input type="date" {...register("fecha_instalacion")} />
        <input {...register("fecha_fabricacion")} placeholder="Fecha/Año fabricación" />
        <input {...register("referencia")} placeholder="Referencia" />
        <input {...register("manual")} placeholder="Manual" />
        <input {...register("pais_fabricacion")} placeholder="País de fabricación" />
        <input {...register("garantia")} placeholder="Garantía" />
        <input {...register("forma_adquisicion")} placeholder="Forma de adquisición" />
        <input {...register("invima")} placeholder="INVIMA" />
        <input {...register("proveedor")} placeholder="Proveedor" />
        <input {...register("peso")} placeholder="Peso" />
        <input {...register("ancho")} placeholder="Ancho" />
        <input {...register("fondo")} placeholder="Fondo" />
        <input {...register("alto")} placeholder="Alto" />
        <input {...register("resolucion")} placeholder="Resolución" />
        <input {...register("capacidad")} placeholder="Capacidad" />
        <input {...register("fuente_alimentacion")} placeholder="Fuente de alimentación" />
        <input {...register("voltaje")} placeholder="Voltaje" />
        <input {...register("potencia")} placeholder="Potencia" />
        <input {...register("pantalla")} placeholder="Pantalla" />
        <input {...register("codigo_inventario")} placeholder="Código inventario" />
        <input {...register("uso")} placeholder="Uso" />
        <input {...register("riesgo")} placeholder="Riesgo" />
        <input {...register("clasificacion_biomedica")} placeholder="Clasificación biomédica" />
        <input {...register("tecnologia_predominante")} placeholder="Tecnología predominante" />
        <input {...register("tipo_equipo")} placeholder="Tipo equipo" />
        <input {...register("estado_equipo")} placeholder="Estado del equipo" />
        <input {...register("frecuencia_mantenimiento")} placeholder="Frecuencia mantenimiento" />

        <textarea
          {...register("otras_especificaciones")}
          placeholder="Otras especificaciones"
          style={{ gridColumn: "span 2", minHeight: "80px" }}
        />

        <textarea
          {...register("observaciones")}
          placeholder="Observaciones"
          style={{ gridColumn: "span 2", minHeight: "80px" }}
        />

        <textarea
          {...register("descripcion")}
          placeholder="Descripción"
          style={{ gridColumn: "span 2", minHeight: "100px" }}
        />

        <button type="submit" style={{ gridColumn: "span 2" }}>
          Guardar equipo
        </button>
      </form>
    </div>
  );
}