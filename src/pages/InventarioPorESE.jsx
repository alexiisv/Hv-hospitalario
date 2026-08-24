import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerEsePorId, obtenerInventarioPorEse } from "../services/eseService";

import * as XLSX from "xlsx";

import {
  FaFileImport,
  FaPlus,
  FaFilePdf,
  FaLayerGroup,
  FaFileExcel,
  FaSearch,
  FaHospital,
  FaHeartbeat,
} from "react-icons/fa";
import Inventario from "./Inventario";

export default function InventarioPorESE() {
  const { id } = useParams();

  const [ese, setEse] = useState(null);
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const [eseData, inventarioData] = await Promise.all([
        obtenerEsePorId(id),
        obtenerInventarioPorEse(id),
      ]);

      console.log("Inventario recibido", inventarioData);

      setEse(eseData);
      setInventario(inventarioData);
    } catch (error) {
      console.error("Error al cargar inventario por ESE:", error);
    } finally {
      setCargando(false);
    }
  };


  // =========================================================
  // FILTRO DE BÚSQUEDA
  // =========================================================

  const inventarioFiltrado = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    if (!texto) {
      return inventario;
    }

    return inventario.filter((item) => {
      return [
        item.equipo,
        item.marca,
        item.modelo,
        item.serie,
        item.area,
        item.ubicacion,
        item.codigo_inventario,
        item.invima,
        // item.registro_sanitario,
        item.riesgo,
        item.estado_equipo,
      ].some((valor) =>
        String(valor || "")
          .toLowerCase()
          .includes(texto)
      );
    });
  }, [inventario, busqueda]);

  // =========================================================
  // EXPORTAR EXCEL
  // =========================================================

  const exportarExcel = () => {
    if (inventarioFiltrado.length === 0) {
      alert("No hay equipos para exportar.");
      return;
    }

    const datosExcel = inventarioFiltrado.map((item) => ({
      Área: item.area || "",
      Ubicación: item.ubicacion || "",
      Equipo: item.equipo || "",
      Marca: item.marca || "",
      Modelo: item.modelo || "",
      Serie: item.serie || "",
      Invima:item.invima || item.registro_sanitario || "",
      Riesgo: item.riesgo || "",
    }));

    const hoja = XLSX.utils.json_to_sheet(datosExcel);

    // Ancho de columnas
    hoja["!cols"] = [
      { wch: 22 }, // Área
      { wch: 25 }, // Ubicación
      { wch: 30 }, // Equipo
      { wch: 20 }, // Marca
      { wch: 20 }, // Modelo
      { wch: 22 }, // Serie
      { wch: 28 }, // Registro sanitario
      { wch: 15 }, // Riesgo
    ];

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      libro,
      hoja,
      "Inventario Biomédico"
    );

    const nombreESE = (ese?.nombre || "ESE")
      .replace(/[\\/:*?"<>|]/g, "")
      .replace(/\s+/g, "_");

    XLSX.writeFile(
      libro,
      `Inventario_Biomedico_${nombreESE}.xlsx`
    );
  };

  // =========================================================
  // COLOR ESTADO
  // =========================================================

  const obtenerColorEstado = (estado) => {
    const valor = String(estado || "").toLowerCase();

    if (
      valor.includes("bueno") ||
      valor.includes("operativo") ||
      valor.includes("funcional")
    ) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (
      valor.includes("regular") ||
      valor.includes("mantenimiento")
    ) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (
      valor.includes("malo") ||
      valor.includes("fuera") ||
      valor.includes("inactivo")
    ) {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  // =========================================================
  // COLOR RIESGO
  // =========================================================

  const obtenerColorRiesgo = (riesgo) => {
    const valor = String(riesgo || "")
      .toUpperCase()
      .replace(/\s/g, "");

    if (valor === "I") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (valor === "IIA") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (valor === "IIB") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (valor === "III") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  // =========================================================
  // CARGANDO
  // =========================================================

  if (cargando) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />

          <p className="text-sm font-medium text-slate-500">
            Cargando inventario...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ESE NO ENCONTRADA
  // =========================================================

  if (!ese) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">
          No se encontró la ESE.
        </p>
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6">
      {/* =====================================================
          CABECERA ESE
      ====================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400" />

        <div className="p-5 lg:p-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          {/* INFORMACIÓN ESE */}

          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center justify-center overflow-hidden">
              {ese.logo_url ? (
                <img
                  src={ese.logo_url}
                  alt={ese.nombre}
                  className="h-full w-full object-contain p-1"
                />
              ) : (
                <FaHospital className="text-2xl text-blue-500" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <FaHeartbeat className="text-blue-600" />

                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Inventario Biomédico
                </span>
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                {ese.nombre}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {ese.ciudad || "Ciudad no registrada"}
                {ese.departamento &&
                  `, ${ese.departamento}`}
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                NIT: {ese.nit || "No registrado"}
              </p>
            </div>
          </div>

          {/* TOTAL EQUIPOS */}

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-5 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FaHeartbeat />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total equipos
              </p>

              <p className="text-xl font-bold text-slate-800">
                {inventario.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BARRA DE ACCIONES
      ====================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* BOTONES PRINCIPALES */}

          <div className="flex flex-wrap gap-2">
            <Link
              to={`/eses/${ese.id}/inventario/nuevo`}
              className="
                inline-flex items-center gap-2
                rounded-xl
                bg-blue-600
                px-4 py-2.5
                text-sm font-semibold text-white
                shadow-sm
                transition
                hover:bg-blue-700
                hover:shadow-md
              "
            >
              <FaPlus />
              Registrar equipo
            </Link>

            <Link
              to={`/eses/${ese.id}/inventario/importar`}
              className="
                inline-flex items-center gap-2
                rounded-xl
                border border-slate-200
                bg-white
                px-4 py-2.5
                text-sm font-semibold text-slate-700
                transition
                hover:border-blue-200
                hover:bg-blue-50
                hover:text-blue-700
              "
            >
              <FaFileImport />
              Importar
            </Link>

            {/* BOTÓN EXCEL */}

            <button
              type="button"
              onClick={exportarExcel}
              className="
                inline-flex items-center gap-2
                rounded-xl
                border border-emerald-200
                bg-emerald-50
                px-4 py-2.5
                text-sm font-semibold text-emerald-700
                transition
                hover:bg-emerald-100
              "
            >
              <FaFileExcel className="text-base" />
              Exportar Excel
            </button>
          </div>

          {/* PDFs */}

          <div className="flex flex-wrap gap-2">
            <a
              href={`http://localhost:3001/pdf/ese/${ese.id}/preventivos`}
              className="
                inline-flex items-center gap-2
                rounded-xl
                border border-purple-200
                bg-purple-50
                px-4 py-2.5
                text-sm font-semibold text-purple-700
                transition
                hover:bg-purple-100
              "
            >
              <FaFilePdf />
              Preventivos
            </a>

            <a
              href={`http://localhost:3001/pdf/ese/${ese.id}/todos-unificado`}
              target="_blank"
              rel="noreferrer"
              className="
                inline-flex items-center gap-2
                rounded-xl
                bg-slate-800
                px-4 py-2.5
                text-sm font-semibold text-white
                transition
                hover:bg-slate-900
              "
            >
              <FaLayerGroup />
              PDF unificado
            </a>
          </div>
        </div>
      </div>

      {/* =====================================================
          BUSCADOR
      ====================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Equipos registrados
              </h2>

              <p className="text-xs text-slate-400 mt-0.5">
                Consulta y administra el inventario biomédico
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar equipo, serie, área..."
                className="
                  w-full
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  py-2.5 pl-10 pr-4
                  text-sm text-slate-700
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-400
                  focus:bg-white
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>
          </div>
        </div>

        {/* =================================================
            TABLA
        ================================================== */}

        {inventarioFiltrado.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <FaSearch className="text-slate-400" />
            </div>

            <p className="font-medium text-slate-600">
              {inventario.length === 0
                ? "Esta ESE todavía no tiene equipos registrados."
                : "No se encontraron equipos."}
            </p>

            {busqueda && (
              <p className="mt-1 text-sm text-slate-400">
                Intenta realizar otra búsqueda.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[1500px] w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      ID
                    </th>

                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Equipo
                    </th>

                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Marca
                    </th>

                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Modelo
                    </th>

                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Serie
                    </th>

                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Área
                    </th>

                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Ubicación
                    </th>

                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Registro sanitario
                    </th>

                    {/* NUEVA COLUMNA */}

                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Riesgo
                    </th>

                    {/* NUEVA COLUMNA */}

                    <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                      Estado
                    </th>

                    <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                      Codigo
                    </th>

                    <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                      PDF
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {inventarioFiltrado.map((item) => (
                    <tr
                      key={item.id}
                      className="group bg-white transition hover:bg-blue-50/30"
                    >
                      <td className="px-4 py-3.5 text-slate-400">
                        {item.id}
                      </td>

                      {/* EQUIPO */}

                      <td className="px-4 py-3.5">
                        <Link
                          to={`/inventario/${item.id}`}
                          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {item.equipo || "—"}
                        </Link>
                      </td>

                      <td className="px-4 py-3.5 text-slate-600">
                        {item.marca || "—"}
                      </td>

                      <td className="px-4 py-3.5 text-slate-600">
                        {item.modelo || "—"}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-xs text-slate-600">
                        {item.serie || "—"}
                      </td>

                      <td className="px-4 py-3.5 text-slate-600">
                        {item.area || "—"}
                      </td>

                      <td className="px-4 py-3.5 text-slate-600">
                        {item.ubicacion || "—"}
                      </td>

                      {/* REGISTRO SANITARIO */}

                      <td className="px-4 py-3.5 text-slate-600">
                        <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                        {item.invima || "—"}
                        </span>
                      </td>

                      {/* RIESGO */}

                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`
                            inline-flex min-w-[45px] justify-center
                            rounded-full border
                            px-2.5 py-1
                            text-xs font-bold
                            ${obtenerColorRiesgo(item.riesgo)}
                          `}
                        >
                          {item.riesgo || "—"}
                        </span>
                      </td>

                      {/* ESTADO */}

                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`
                            inline-flex
                            rounded-full border
                            px-3 py-1
                            text-xs font-semibold
                            ${obtenerColorEstado(
                              item.estado_equipo
                            )}
                          `}
                        >
                          {item.estado_equipo || "Sin estado"}
                        </span>
                      </td>

                       <td className="px-4 py-3.5">
                        <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                          {item.codigo_inventario || "—"}
                        </span>
                      </td>

                      {/* PDF */}

                      <td className="px-4 py-3.5 text-center">
                        <a
                          href={`http://localhost:3001/pdf/equipo/${item.id}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Generar hoja de vida PDF"
                          className="
                            inline-flex h-9 w-9
                            items-center justify-center
                            rounded-lg
                            border border-red-200
                            bg-red-50
                            text-red-600
                            transition
                            hover:bg-red-100
                            hover:scale-105
                          "
                        >
                          <FaFilePdf />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PIE TABLA */}

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3">
              <span className="text-xs text-slate-400">
                Mostrando{" "}
                <strong className="text-slate-600">
                  {inventarioFiltrado.length}
                </strong>{" "}
                de{" "}
                <strong className="text-slate-600">
                  {inventario.length}
                </strong>{" "}
                equipos
              </span>

              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda("")}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}