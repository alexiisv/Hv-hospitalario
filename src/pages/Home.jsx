export default function Home() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-8">
      <h2 className="text-3xl font-bold text-slate-800 mb-3">
        Bienvenido
      </h2>
      <p className="text-slate-600 leading-relaxed">
        Desde aquí podrás gestionar el catálogo biomédico, registrar equipos en inventario,
        visualizar hojas de vida técnicas y posteriormente generar PDF por cada equipo.
      </p>
    </div>
  );
}