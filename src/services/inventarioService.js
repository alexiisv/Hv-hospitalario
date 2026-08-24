import axios from "axios";

// const API = "http://localhost:3001";
 const API =import.meta.env.VITE_API_URL;

export const crearEquipoInventario = async (data) => {
  const res = await axios.post(`${API}/inventario`, data);
  return res.data;
};

export const obtenerInventario = async () => {
  const res = await axios.get(`${API}/inventario`);
  return res.data;
};

export const obtenerInventarioPorId = async (id) => {
  const res = await axios.get(`${API}/inventario/${id}`);
  return res.data;
};