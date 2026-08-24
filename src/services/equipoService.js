import axios from "axios";

// const API = "http://localhost:3001";
 const API =import.meta.env.VITE_API_URL;

export const obtenerEquipos = async () => {
  const res = await axios.get(`${API}/equipos`);
  return res.data;
};

export const obtenerEquipoPorId = async (id) => {
    const res = await axios.get(`${API}/equipos/${id}`);
    return res.data;
}

export const crearEquipo = async (equipo) => {
  const res = await axios.post(`${API}/equipos`, equipo);
  return res.data;
};

export const vaciarEse = async (id) => {
  const res = await axios.delete(`/eses/${id}/vaciar`);
  return res.data;
};