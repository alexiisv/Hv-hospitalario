import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerCatalogo, eliminarCatalogo } from "../../services/catalogoService";

export default function Catalogo() {
  const [catalogo, setCatalogo] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarCatalogo();
  }, []);

  const cargarCatalogo = async () => {
    try {
      const data = await obtenerCatalogo();
      setCatalogo(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  const eliminar = async (id) => {
    const confirmar = confirm("¿Seguro que deseas eliminar este equipo?");
    if (!confirmar) return;

    try {
      await eliminarCatalogo(id);
      cargarCatalogo();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  if (cargando) {
    return <p>Cargando catálogo...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow border">
        <div>
          <h2 className="text-2xl font-bold">Catálogo de equipos</h2>
          <p className="text-sm text-slate-500">
            Base principal de equipos biomédicos
          </p>
        </div>

        <Link
          to="/catalogo/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          + Nuevo equipo
        </Link>
       
      </div>

      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3">Imagen</th>
              <th className="px-4 py-3">Equipo</th>
              <th className="px-4 py-3">Marca</th>
              <th className="px-4 py-3">Modelo</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {catalogo.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-3">
                  {item.imagen_url ? (
                    <img
                      src={item.imagen_url}
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    "Sin imagen"
                  )}
                </td>

                <td className="px-4 py-3">{item.equipo}</td>
                <td className="px-4 py-3">{item.marca}</td>
                <td className="px-4 py-3">{item.modelo}</td>

                <td className="px-4 py-3 space-x-2">
                  <Link
                    to={`/catalogo/editar/${item.id}`}
                    className="text-blue-600"
                  >
                    Editar
                  </Link>
                  
                  <Link
                    to={`/catalogo/gestion/${item.id}`}
                    className="rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700 hover:bg-green-200"
                  >
                    Actividades
                  </Link>
                  <button
                    onClick={() => eliminar(item.id)}
                    className="text-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}