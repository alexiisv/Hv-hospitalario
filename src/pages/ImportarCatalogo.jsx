import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  validarImportacionCatalogo,
  guardarImportacionCatalogo,
} from "../services/importarCatalogoService";

export default function ImportarCatalogo() {
  const navigate = useNavigate();

  const [archivo, setArchivo] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [validando, setValidando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const estadoClass = {
    nuevo: "bg-green-100 text-green-700 border-green-200",
    duplicado: "bg-yellow-100 text-yellow-700 border-yellow-200",
    error: "bg-red-100 text-red-700 border-red-200",
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const validar = async () => {
    if (!archivo) {
      alert("Selecciona un archivo Excel");
      return;
    }

    try {
      setValidando(true);

      const data = await validarImportacionCatalogo(archivo);

      const resultadosConSeleccion = data.resultados.map((item) => ({
        ...item,
        aprobado: item.estado === "nuevo",
      }));

      setResumen(data.resumen);
      setResultados(resultadosConSeleccion);
    } catch (error) {
      console.error("Error validando catálogo:", error);
      alert("Error validando el archivo");
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

  const guardar = async () => {
    const registrosAprobados = resultados.filter(
      (item) => item.aprobado && item.estado === "nuevo"
    );

    if (registrosAprobados.length === 0) {
      alert("No hay registros nuevos aprobados para guardar");
      return;
    }

    try {
      setGuardando(true);

      const respuesta = await guardarImportacionCatalogo(registrosAprobados);

      alert(
        `Importación finalizada. Guardados: ${respuesta.total_guardados}. Errores: ${respuesta.total_errores}`
      );

      navigate("/catalogo");
    } catch (error) {
      console.error("Error guardando catálogo:", error);
      alert("Error guardando catálogo");
    } finally {
      setGuardando(false);
    }
  };

  const totalAprobados = resultados.filter(
    (item) => item.aprobado && item.estado === "nuevo"
  ).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Importar catálogo desde Excel
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Carga equipos base del catálogo maestro validando duplicados por equipo,
          marca y modelo.
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
                : `Guardar nuevos (${totalAprobados})`}
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
            <p className="text-sm text-slate-500">Nuevos</p>
            <p className="text-3xl font-bold text-green-600">
              {resumen.nuevos}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <p className="text-sm text-slate-500">Duplicados</p>
            <p className="text-3xl font-bold text-yellow-600">
              {resumen.duplicados}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <p className="text-sm text-slate-500">Errores</p>
            <p className="text-3xl font-bold text-red-600">
              {resumen.errores}
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
              Solo los registros nuevos pueden guardarse.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr className="text-left text-slate-600">
                  <th className="px-4 py-3">Guardar</th>
                  <th className="px-4 py-3">Fila</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Equipo</th>
                  <th className="px-4 py-3">Marca</th>
                  <th className="px-4 py-3">Modelo</th>
                  <th className="px-4 py-3">Mensaje</th>
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
                        disabled={item.estado !== "nuevo"}
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

                    <td className="px-4 py-3">{item.datos?.equipo}</td>
                    <td className="px-4 py-3">{item.datos?.marca}</td>
                    <td className="px-4 py-3">{item.datos?.modelo}</td>
                    <td className="px-4 py-3">{item.mensaje}</td>
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