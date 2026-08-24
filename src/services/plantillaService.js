import axios from "axios";

const API = "http://localhost:3001";

// PLANTILLAS

export const obtenerPlantillas = async () => {
  const res = await axios.get(`${API}/plantillas`);
  return res.data;
};

export const obtenerPlantillaPorId = async (id) => {
  const res = await axios.get(`${API}/plantillas/${id}`);
  return res.data;
};

export const crearPlantilla = async (data) => {
  const res = await axios.post(`${API}/plantillas`, data);
  return res.data;
};

export const actualizarPlantilla = async (id, data) => {
  const res = await axios.put(`${API}/plantillas/${id}`, data);
  return res.data;
};

// export const actualizarPlantilla = async (id, datos) => {
//   const response = await axios.put(
//     `${API_URL}/plantillas/${id}`,
//     datos
//   );

//   return response.data;
// };

export const eliminarPlantilla = async (id) => {
  await axios.delete(`${API}/plantillas/${id}`);
};

// ACTIVIDADES

export const crearActividadPlantilla = async (plantillaId, data) => {
  const res = await axios.post(`${API}/plantillas/${plantillaId}/actividades`, data);
  return res.data;
};

export const actualizarActividadPlantilla = async (actividadId, data) => {
  const res = await axios.put(`${API}/plantillas/actividades/${actividadId}`, data);
  return res.data;
};

export const eliminarActividadPlantilla = async (actividadId) => {
  await axios.delete(`${API}/plantillas/actividades/${actividadId}`);
};

// RECOMENDACIONES

export const crearRecomendacionPlantilla = async (plantillaId, data) => {
  const res = await axios.post(`${API}/plantillas/${plantillaId}/recomendaciones`, data);
  return res.data;
};

export const actualizarRecomendacionPlantilla = async (recomendacionId, data) => {
  const res = await axios.put(`${API}/plantillas/recomendaciones/${recomendacionId}`, data);
  return res.data;
};

export const eliminarRecomendacionPlantilla = async (recomendacionId) => {
  await axios.delete(`${API}/plantillas/recomendaciones/${recomendacionId}`);
};

// APLICAR A CATÁLOGO

export const aplicarPlantillaACatalogo = async (
  plantillaId,
  catalogoId,
  reemplazar = false
) => {
  const res = await axios.post(
    `${API}/plantillas/${plantillaId}/aplicar/${catalogoId}?reemplazar=${reemplazar}`
  );
  return res.data;
};

