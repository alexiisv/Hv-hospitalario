import axios from "axios";

// const API = "http://localhost:3001";

 const API =import.meta.env.VITE_API_URL;
 
export const obtenerCatalogo = async () => {
  const res = await axios.get(`${API}/catalogo`);
  return res.data;
};

export const obtenerCatalogoCompleto = async (id) => {
  const res = await axios.get(`${API}/catalogo/completo/${id}`);
  return res.data;
};

export const crearCatalogo = async (data) => {
  const res = await axios.post(`${API}/catalogo`, data);
  return res.data;
};

export const eliminarCatalogo = async (id) => {
  await axios.delete(`${API}/catalogo/${id}`);
};

export const obtenerCatalogoPorId = async (id) => {
  const res = await axios.get(`${API}/catalogo/${id}`);
  return res.data;
};

export const actualizarCatalogo = async (id, data) => {
  const res = await axios.put(`${API}/catalogo/${id}`, data);
  return res.data;
};