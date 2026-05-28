import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  guardarImportacion,
  validarImportacionExcel,
} from "../../services/importacionService";

export default function ImportarInventario() {
  const { eseId } = useParams();
  const navigate = useNavigate();

  const [archivo, setArchivo] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [validando, setValidando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const estadoClass = {
    exacto: "bg-green-100 text-green-700 border-green-200",
    similar: "bg-yellow-100 text-yellow-700 border-yellow-200",
    no_encontrado: "bg-red-100 text-red-700 border-red-200",
  };

  const validar = async () => {
    if (!archivo) {
      alert("Selecciona un archivo Excel");
      return;
    }

    try {
      setValidando(true);

      const data = await validarImportacionExcel(archivo);

      const resultadosConSeleccion = data.resultados.map((item) => ({
        ...item,
        aprobado: item.estado === "exacto",
        catalogo_id_seleccionado: item.catalogo_id || "",
      }));

      setResumen(data.resumen);
      setResultados(resultadosConSeleccion);
    } catch (error) {
      console.error("Error al validar Excel:", error);
      alert("Ocurrió un error al validar el Excel");
    } finally {
      setValidando(false);
    }
  };

  const cambiarAprobado = (fila) => {
    setResultados((prev) =>
      prev.map((item) =>
        item.fila === fila ? { ...item, aprobado: !item.aprobado } : item
      )
    );
  };

  const cambiarCatalogo = (fila, catalogoId) => {
    setResultados((prev) =>
      prev.map((item) =>
        item.fila === fila
          ? {
              ...item,
              catalogo_id_seleccionado: catalogoId,
              catalogo_id: catalogoId,
              aprobado: Boolean(catalogoId),
            }
          : item
      )
    );
  };

  const guardar = async () => {
    const registrosAprobados = resultados
      .filter((item) => item.aprobado && item.catalogo_id_seleccionado)
      .map((item) => ({
        fila: item.fila,
        catalogo_id: Number(item.catalogo_id_seleccionado),
        datos: item.datos,
      }));

    if (registrosAprobados.length === 0) {
      alert("No hay registros aprobados para guardar");
      return;
    }

    try {
      setGuardando(true);

      console.log("Registros aprobados a guardar:", registrosAprobados);
console.log("ESE ID:", eseId);
      const respuesta = await guardarImportacion({
        ese_id: Number(eseId),
        registros: registrosAprobados,
      });

      console.log("Respuesta guardar importación:", respuesta);
      console.table(respuesta.errores);
      alert(
        `Importación finalizada. Guardados: ${respuesta.total_guardados}. Errores: ${respuesta.total_errores}`
      );

      navigate(`/eses/${eseId}/inventario`);
    } catch (error) {
      console.error("Error al guardar importación:", error);
      alert("Ocurrió un error al guardar la importación");
    } finally {
      setGuardando(false);
    }
  };

  const totalAprobados = resultados.filter(
    (item) => item.aprobado && item.catalogo_id_seleccionado
  ).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Importar inventario desde Excel
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Sube un archivo Excel para validar los equipos contra el catálogo
          maestro antes de guardarlos.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Archivo Excel
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            className={inputClass}
            onChange={(e) => setArchivo(e.target.files[0])}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={validar}
            disabled={validando}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {validando ? "Validando..." : "Validar Excel"}
          </button>

          {resultados.length > 0 && (
            <button
              onClick={guardar}
              disabled={guardando}
              className="rounded-xl bg-green-600 px-5 py-2.5 text-white font-medium hover:bg-green-700 transition disabled:opacity-60"
            >
              {guardando
                ? "Guardando..."
                : `Guardar aprobados (${totalAprobados})`}
            </button>
          )}
        </div>
      </div>

      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <p className="text-sm text-slate-500">Total filas</p>
            <p className="text-3xl font-bold text-slate-800">{resumen.total}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <p className="text-sm text-slate-500">Exactos</p>
            <p className="text-3xl font-bold text-green-600">
              {resumen.exactos}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <p className="text-sm text-slate-500">Similares</p>
            <p className="text-3xl font-bold text-yellow-600">
              {resumen.similares}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <p className="text-sm text-slate-500">No encontrados</p>
            <p className="text-3xl font-bold text-red-600">
              {resumen.no_encontrados}
            </p>
          </div>
        </div>
      )}

      {resultados.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-5 border-b">
            <h3 className="text-lg font-semibold text-slate-800">
              Resultados de validación
            </h3>
            <p className="text-sm text-slate-500">
              Revisa los similares y no encontrados antes de guardar.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr className="text-left text-slate-600">
                  <th className="px-4 py-3">Aprobar</th>
                  <th className="px-4 py-3">Fila</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Equipo Excel</th>
                  <th className="px-4 py-3">Marca Excel</th>
                  <th className="px-4 py-3">Modelo Excel</th>
                  <th className="px-4 py-3">Sugerencia</th>
                  <th className="px-4 py-3">Seleccionar catálogo</th>
                  <th className="px-4 py-3">Serie</th>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Área</th>
                  <th className="px-4 py-3">Ubicación</th>
                </tr>
              </thead>

              <tbody>
                {resultados.map((item) => (
                  <tr
                    key={item.fila}
                    className="border-b last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={item.aprobado}
                        disabled={!item.catalogo_id_seleccionado}
                        onChange={() => cambiarAprobado(item.fila)}
                        className="h-4 w-4"
                      />
                    </td>

                    <td className="px-4 py-3 font-medium">{item.fila}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                          estadoClass[item.estado]
                        }`}
                      >
                        {item.estado}
                      </span>
                    </td>

                    <td className="px-4 py-3">{item.equipo_excel}</td>
                    <td className="px-4 py-3">{item.marca_excel}</td>
                    <td className="px-4 py-3">{item.modelo_excel}</td>

                    <td className="px-4 py-3 min-w-[260px]">
                      {item.sugerencia ? (
                        <div>
                          <p className="font-medium text-slate-800">
                            {item.sugerencia.equipo} / {item.sugerencia.marca} /{" "}
                            {item.sugerencia.modelo}
                          </p>
                          {item.sugerencia.puntaje && (
                            <p className="text-xs text-slate-500">
                              Coincidencia:{" "}
                              {(item.sugerencia.puntaje * 100).toFixed(0)}%
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-red-500">Sin sugerencia</span>
                      )}
                    </td>

                    <td className="px-4 py-3 min-w-[260px]">
                      {item.candidatos && item.candidatos.length > 0 ? (
                        <select
                          className={inputClass}
                          value={item.catalogo_id_seleccionado}
                          onChange={(e) =>
                            cambiarCatalogo(item.fila, e.target.value)
                          }
                        >
                          <option value="">Seleccionar</option>

                          {item.sugerencia && (
                            <option value={item.sugerencia.id}>
                              {item.sugerencia.equipo} /{" "}
                              {item.sugerencia.marca} /{" "}
                              {item.sugerencia.modelo}
                            </option>
                          )}

                          {item.candidatos.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.equipo} / {c.marca} / {c.modelo} (
                              {(c.puntaje * 100).toFixed(0)}%)
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-slate-500">
                          {item.catalogo_id_seleccionado
                            ? "Asignado automáticamente"
                            : "Sin opciones"}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">{item.datos?.serie}</td>
                    <td className="px-4 py-3">{item.datos?.codigo_inventario}</td>
                    <td className="px-4 py-3">{item.datos?.area}</td>
                    <td className="px-4 py-3">{item.datos?.ubicacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}