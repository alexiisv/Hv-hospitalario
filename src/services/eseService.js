import axios from "axios";

const API = "http://localhost:3001";

export const obtenerEses = async () => {
  const res = await axios.get(`${API}/eses`);
  return res.data;
};

export const obtenerEsePorId = async (id) => {
  const res = await axios.get(`${API}/eses/${id}`);
  return res.data;
};

export const obtenerInventarioPorEse = async (id) => {
  const res = await axios.get(`${API}/eses/${id}/inventario`);
  return res.data;
};

export const crearEse = async (data) => {
  const res = await axios.post(`${API}/eses`, data);
  return res.data;
};

export const actualizarEse = async (id, data) => {
  const res = await axios.put(`${API}/eses/${id}`, data);
  return res.data;
};

export const eliminarEse = async (id) => {
  await axios.delete(`${API}/eses/${id}`);
};

// Vaciar todo el inventario de una ESE
export const vaciarEse = async (id) => {
  const response = await axios.delete(`${API}/eses/${id}/vaciar`);
  return response.data;
};