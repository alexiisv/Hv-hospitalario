// export default function Home() {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm border p-8">
//       <h2 className="text-3xl font-bold text-slate-800 mb-3">
//         Bienvenido
//       </h2>
//       <p className="text-slate-600 leading-relaxed">
//         Desde aquí podrás gestionar el catálogo biomédico, registrar equipos en inventario,
//         visualizar hojas de vida técnicas y posteriormente generar PDF por cada equipo.
//       </p>
//     </div>
//   );
// }
import {
  FaClipboardList,
  FaFilePdf,
  FaDatabase,
  FaHospital,
  FaArrowRight,
  FaListOl,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 p-8 text-white shadow-lg">
              {/* <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 p-8 text-white shadow-lg"> */}

        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-20 right-20 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl"></div>

        <div className="relative z-10 grid gap-8 md:grid-cols-2 md:items-center">
          
          <div >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
              <FaHospital />
              Sistema de gestión biomédica
            </div>

            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
              Hojas de Vida de Equipos Biomédicos
            </h1>

            <p className="mb-6 max-w-xl text-blue-100 leading-relaxed">
              Administra ESEs, inventarios, catálogo técnico, hojas de vida y
              generación masiva de PDFs desde una plataforma moderna y organizada.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/eses"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 shadow hover:bg-blue-50 transition"
              >
                Gestionar ESEs
                <FaArrowRight />
              </Link>

              {/* <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 font-semibold text-white hover:bg-white/10 transition"
              >
                Ver catálogo
              </Link> */}
            </div>
          </div>

          <div className="hidden md:flex justify-center">
            <div className="relative h-72 w-72 rounded-3xl bg-white/10 p-6 backdrop-blur rotate-3 hover:rotate-0 transition duration-500">
              <div className="absolute inset-4 rounded-2xl bg-white shadow-xl"></div>

              <div className="relative z-10 space-y-4 text-slate-700">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="text-xs text-slate-400">Formato</p>
                    <p className="font-bold text-slate-800">Hoja de Vida</p>
                  </div>
                  <FaFilePdf className="text-3xl text-red-500" />
                </div>

                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-slate-200"></div>
                  <div className="h-3 w-10/12 rounded bg-slate-200"></div>
                  <div className="h-3 w-8/12 rounded bg-slate-200"></div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl bg-blue-50 p-3">
                    <FaClipboardList className="mb-2 text-blue-600" />
                    <p className="text-xs font-semibold">Inventario</p>
                  </div>

                  <div className="rounded-xl bg-green-50 p-3">
                    <FaDatabase className="mb-2 text-green-600" />
                    <p className="text-xs font-semibold">Catálogo</p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-100 p-3">
                  <p className="text-xs text-slate-500">Estado del equipo</p>
                  <p className="font-semibold text-green-600">Operativo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
          <Link
            to="/eses"              >
            <FaHospital className="mb-4 text-3xl text-blue-600" />
          </Link>
          <h3 className="mb-2 font-bold text-slate-800">ESE</h3>
          <p className="text-sm text-slate-500">
            Crea y administra instituciones con sus datos, logos e inventario.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
          <Link
            to="/catalogo"              >
            <FaClipboardList className="mb-4 text-3xl text-purple-600" />
          </Link>
          <h3 className="mb-2 font-bold text-slate-800">Catalogo</h3>
          <p className="text-sm text-slate-500">
            Registra equipos biomédicos Marca Modelo y caracteristicas generales.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
          <Link
            to="/plantillas"              >
            <FaListOl className="mb-4 text-3xl text-green-600" />
          </Link>
          <h3 className="mb-2 font-bold text-slate-800">Plantillas</h3>
          <p className="text-sm text-slate-500">
            Genera Plantillas de actividades grupales para los equipos.
          </p>
        </div>
      </div>
    </div>
  );
}