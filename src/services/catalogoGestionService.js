const API_URL = "http://localhost:3001/catalogo";

// ACTIVIDADES

export const obtenerActividades = async (catalogoId) => {
  const res = await fetch(`${API_URL}/${catalogoId}/actividades`);
  return await res.json();
};

export const crearActividad = async (catalogoId, data) => {
  const res = await fetch(`${API_URL}/${catalogoId}/actividades`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
};

export const actualizarActividad = async (actividadId, data) => {
  const res = await fetch(
    `${API_URL}/actividades/${actividadId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return await res.json();
};

export const eliminarActividad = async (actividadId) => {
  const res = await fetch(
    `${API_URL}/actividades/${actividadId}`,
    {
      method: "DELETE",
    }
  );

  return await res.json();
};

// RECOMENDACIONES

export const obtenerRecomendaciones = async (catalogoId) => {
  const res = await fetch(
    `${API_URL}/${catalogoId}/recomendaciones`
  );

  return await res.json();
};

export const crearRecomendacion = async (catalogoId, data) => {
  const res = await fetch(
    `${API_URL}/${catalogoId}/recomendaciones`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return await res.json();
};

export const actualizarRecomendacion = async (
  recomendacionId,
  data
) => {
  const res = await fetch(
    `${API_URL}/recomendaciones/${recomendacionId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return await res.json();
};

export const eliminarRecomendacion = async (
  recomendacionId
) => {
  const res = await fetch(
    `${API_URL}/recomendaciones/${recomendacionId}`,
    {
      method: "DELETE",
    }
  );

  return await res.json();
};