import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  obtenerCatalogo,
  eliminarCatalogo,
} from "../../services/catalogoService";

import {
  Pencil,
  ClipboardList,
  Trash2,
  Search,
  X,
  Plus,
  FileSpreadsheet,
  PackageSearch,
  Boxes,
  Tags,
  ScanBarcode,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ImageOff,
} from "lucide-react";

const REGISTROS_POR_PAGINA = 10;

export default function Catalogo() {
  const [catalogo, setCatalogo] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [eliminandoId, setEliminandoId] = useState(null);

  const [busquedaGeneral, setBusquedaGeneral] = useState("");

  const [filtros, setFiltros] = useState({
    equipo: "",
    marca: "",
    modelo: "",
    invima: "",
  });

  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    cargarCatalogo();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busquedaGeneral, filtros]);

  const cargarCatalogo = async () => {
    try {
      setCargando(true);

      const data = await obtenerCatalogo();

      setCatalogo(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar el catálogo:", error);
      setCatalogo([]);
    } finally {
      setCargando(false);
    }
  };

  const eliminar = async (id, nombreEquipo) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el equipo "${
        nombreEquipo || "seleccionado"
      }"?`
    );

    if (!confirmar) return;

    try {
      setEliminandoId(id);

      await eliminarCatalogo(id);
      await cargarCatalogo();
    } catch (error) {
      console.error("Error al eliminar el equipo:", error);

      window.alert(
        "No fue posible eliminar el equipo. Verifica si está relacionado con algún inventario."
      );
    } finally {
      setEliminandoId(null);
    }
  };

  const manejarFiltro = (event) => {
    const { name, value } = event.target;

    setFiltros((filtrosAnteriores) => ({
      ...filtrosAnteriores,
      [name]: value,
    }));
  };

  const limpiarFiltros = () => {
    setBusquedaGeneral("");

    setFiltros({
      equipo: "",
      marca: "",
      modelo: "",
      invima: "",
    });
  };

  const normalizarTexto = (valor) => {
    return String(valor || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  const catalogoFiltrado = useMemo(() => {
    const busqueda = normalizarTexto(busquedaGeneral);

    return catalogo.filter((item) => {
      const equipo = normalizarTexto(item.equipo);
      const marca = normalizarTexto(item.marca);
      const modelo = normalizarTexto(item.modelo);
      const invima = normalizarTexto(item.invima);

      const coincideBusquedaGeneral =
        !busqueda ||
        equipo.includes(busqueda) ||
        marca.includes(busqueda) ||
        modelo.includes(busqueda) ||
        invima.includes(busqueda);

      const coincideEquipo = equipo.includes(
        normalizarTexto(filtros.equipo)
      );

      const coincideMarca = marca.includes(normalizarTexto(filtros.marca));

      const coincideModelo = modelo.includes(
        normalizarTexto(filtros.modelo)
      );

      const coincideInvima = invima.includes(
        normalizarTexto(filtros.invima)
      );

      return (
        coincideBusquedaGeneral &&
        coincideEquipo &&
        coincideMarca &&
        coincideModelo &&
        coincideInvima
      );
    });
  }, [catalogo, busquedaGeneral, filtros]);

  const estadisticas = useMemo(() => {
    const marcas = new Set(
      catalogo
        .map((item) => normalizarTexto(item.marca))
        .filter(Boolean)
    );

    const modelos = new Set(
      catalogo
        .map((item) => normalizarTexto(item.modelo))
        .filter(Boolean)
    );

    const conInvima = catalogo.filter(
      (item) => normalizarTexto(item.invima) !== ""
    ).length;

    return {
      total: catalogo.length,
      marcas: marcas.size,
      modelos: modelos.size,
      conInvima,
    };
  }, [catalogo]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(catalogoFiltrado.length / REGISTROS_POR_PAGINA)
  );

  const paginaSegura = Math.min(paginaActual, totalPaginas);

  const indiceInicial =
    (paginaSegura - 1) * REGISTROS_POR_PAGINA;

  const indiceFinal = indiceInicial + REGISTROS_POR_PAGINA;

  const registrosPagina = catalogoFiltrado.slice(
    indiceInicial,
    indiceFinal
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;

    setPaginaActual(nuevaPagina);
  };

  const obtenerPaginasVisibles = () => {
    const paginas = [];
    const cantidadMaxima = 5;

    let inicio = Math.max(
      1,
      paginaSegura - Math.floor(cantidadMaxima / 2)
    );

    let fin = Math.min(
      totalPaginas,
      inicio + cantidadMaxima - 1
    );

    if (fin - inicio + 1 < cantidadMaxima) {
      inicio = Math.max(1, fin - cantidadMaxima + 1);
    }

    for (let pagina = inicio; pagina <= fin; pagina += 1) {
      paginas.push(pagina);
    }

    return paginas;
  };

  const filtrosActivos =
    busquedaGeneral ||
    filtros.equipo ||
    filtros.marca ||
    filtros.modelo ||
    filtros.invima;

  if (cargando) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <div className="text-center">
            <p className="font-semibold text-slate-700">
              Cargando catálogo
            </p>

            <p className="text-sm text-slate-500">
              Consultando los equipos registrados...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado principal */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 px-6 py-7 text-white shadow-xl md:px-8">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 right-32 h-52 w-52 rounded-full bg-blue-400/10" />  

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="hidden rounded-2xl border border-white/10 bg-white/10 p-4 shadow-inner backdrop-blur sm:flex">
              <PackageSearch size={32} />
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-100">
                  Gestión biomédica
                </span>

                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                  {estadisticas.total} registros
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Catálogo de equipos biomédicos
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100/80">
                Administra la base principal de equipos, marcas,
                modelos, registros INVIMA y actividades de
                mantenimiento.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/catalogo/importar"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              <FileSpreadsheet size={18} />
              Importar Excel
            </Link>

            <Link
              to="/catalogo/nuevo"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-800 shadow-lg transition hover:bg-blue-50"
            >
              <Plus size={18} />
              Nuevo equipo
            </Link>
          </div>
        </div>
      </section>

      {/* Tarjetas estadísticas */}
      {/* <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <TarjetaEstadistica
          titulo="Total de equipos"
          valor={estadisticas.total}
          descripcion="Registros del catálogo"
          icono={<Boxes size={22} />}
          clasesIcono="bg-blue-50 text-blue-700"
        />

        <TarjetaEstadistica
          titulo="Marcas registradas"
          valor={estadisticas.marcas}
          descripcion="Fabricantes diferentes"
          icono={<Tags size={22} />}
          clasesIcono="bg-violet-50 text-violet-700"
        />

        <TarjetaEstadistica
          titulo="Modelos registrados"
          valor={estadisticas.modelos}
          descripcion="Referencias diferentes"
          icono={<ScanBarcode size={22} />}
          clasesIcono="bg-amber-50 text-amber-700"
        />

        <TarjetaEstadistica
          titulo="Con registro INVIMA"
          valor={estadisticas.conInvima}
          descripcion={`De ${estadisticas.total} equipos`}
          icono={<ClipboardList size={22} />}
          clasesIcono="bg-emerald-50 text-emerald-700"
        />
      </section> */}

      {/* Buscador y filtros */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal
                size={19}
                className="text-blue-600"
              />

              <h2 className="font-bold text-slate-800">
                Búsqueda y filtros
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Busca por cualquier dato o utiliza filtros específicos.
            </p>
          </div>

          <div className="relative w-full xl:max-w-xl">
            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={busquedaGeneral}
              onChange={(event) =>
                setBusquedaGeneral(event.target.value)
              }
              placeholder="Buscar equipo, marca, modelo o INVIMA..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            {busquedaGeneral && (
              <button
                type="button"
                onClick={() => setBusquedaGeneral("")}
                title="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {/* <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <CampoFiltro
            etiqueta="Equipo"
            name="equipo"
            value={filtros.equipo}
            onChange={manejarFiltro}
            placeholder="Ej. Monitor"
          />

          <CampoFiltro
            etiqueta="Marca"
            name="marca"
            value={filtros.marca}
            onChange={manejarFiltro}
            placeholder="Ej. Mindray"
          />

          <CampoFiltro
            etiqueta="Modelo"
            name="modelo"
            value={filtros.modelo}
            onChange={manejarFiltro}
            placeholder="Ej. uMEC12"
          />

          <CampoFiltro
            etiqueta="Registro INVIMA"
            name="invima"
            value={filtros.invima}
            onChange={manejarFiltro}
            placeholder="Ej. 2024DM"
          />

          <div className="flex items-end">
            <button
              type="button"
              onClick={limpiarFiltros}
              disabled={!filtrosActivos}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X size={17} />
              Limpiar filtros
            </button>
          </div>
        </div> */}
      </section>

      {/* Tabla */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-800">
              Equipos registrados
            </h2>

          
          </div>

          {filtrosActivos && (
            <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              {catalogoFiltrado.length === 1
                ? "Se encontró 1 equipo"
                : `Se encontraron ${catalogoFiltrado.length} equipos`}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1050px] w-full text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="w-28 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Imagen
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Equipo
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Marca
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Modelo
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Registro INVIMA
                </th>

                <th className="w-44 px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {registrosPagina.length > 0 ? (
                registrosPagina.map((item) => (
                  <tr
                    key={item.id}
                    className="group transition hover:bg-blue-50/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex h-16 w-20 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
                        {item.imagen_url ? (
                          <img
                            src={item.imagen_url}
                            alt={`Imagen de ${
                              item.equipo || "equipo"
                            }`}
                            className="h-full w-full object-contain p-1.5 transition duration-300 group-hover:scale-105"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <ImageOff
                            size={23}
                            className="text-slate-300"
                          />
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold uppercase text-slate-800">
                        {item.equipo || "Sin información"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Código de catálogo: {item.id}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 font-medium text-slate-700">
                        {item.marca || "Sin información"}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-700">
                      {item.modelo || "Sin información"}
                    </td>

                    <td className="px-5 py-4">
                      {item.invima ? (
                        <div>
                          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Registrado
                          </span>

                          <p className="mt-2 max-w-60 break-words text-xs font-medium text-slate-600">
                            {item.invima}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                          Sin registro
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/catalogo/editar/${item.id}`}
                          title="Editar equipo"
                          aria-label={`Editar ${
                            item.equipo || "equipo"
                          }`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700 transition hover:border-blue-300 hover:bg-blue-600 hover:text-white"
                        >
                          <Pencil size={18} />
                        </Link>

                        <Link
                          to={`/catalogo/gestion/${item.id}`}
                          title="Gestionar actividades"
                          aria-label={`Gestionar actividades de ${
                            item.equipo || "equipo"
                          }`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-600 hover:text-white"
                        >
                          <ClipboardList size={18} />
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            eliminar(item.id, item.equipo)
                          }
                          disabled={eliminandoId === item.id}
                          title="Eliminar equipo"
                          aria-label={`Eliminar ${
                            item.equipo || "equipo"
                          }`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-700 transition hover:border-red-300 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {eliminandoId === item.id ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-red-700" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
                        <PackageSearch size={34} />
                      </div>

                      <h3 className="mt-4 font-bold text-slate-700">
                        No se encontraron equipos
                      </h3>

                      <p className="mt-1 max-w-md text-sm text-slate-500">
                        No existen registros que coincidan con la
                        búsqueda o los filtros seleccionados.
                      </p>

                      {filtrosActivos && (
                        <button
                          type="button"
                          onClick={limpiarFiltros}
                          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          <X size={17} />
                          Limpiar filtros
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {catalogoFiltrado.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Mostrando{" "}
              <span className="font-semibold text-slate-700">
                {indiceInicial + 1}
              </span>{" "}
              a{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(
                  indiceFinal,
                  catalogoFiltrado.length
                )}
              </span>{" "}
              de{" "}
              <span className="font-semibold text-slate-700">
                {catalogoFiltrado.length}
              </span>{" "}
              registros
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => cambiarPagina(paginaSegura - 1)}
                disabled={paginaSegura === 1}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                title="Página anterior"
              >
                <ChevronLeft size={18} />
              </button>

              {obtenerPaginasVisibles().map((pagina) => (
                <button
                  type="button"
                  key={pagina}
                  onClick={() => cambiarPagina(pagina)}
                  className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-semibold transition ${
                    pagina === paginaSegura
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {pagina}
                </button>
              ))}

              <button
                type="button"
                onClick={() => cambiarPagina(paginaSegura + 1)}
                disabled={paginaSegura === totalPaginas}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                title="Página siguiente"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function TarjetaEstadistica({
  titulo,
  valor,
  descripcion,
  icono,
  clasesIcono,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {titulo}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {valor}
          </p>

          <p className="mt-1 hidden text-xs text-slate-400 sm:block">
            {descripcion}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${clasesIcono}`}
        >
          {icono}
        </div>
      </div>
    </article>
  );
}

function CampoFiltro({
  etiqueta,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {etiqueta}
      </span>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}