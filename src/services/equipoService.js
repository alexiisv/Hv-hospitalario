import axios from "axios";

const API = "http://localhost:3001";

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