import axios from "axios";

const API = "http://localhost:3001";

export const validarImportacionExcel = async (archivo) => {
  const formData = new FormData();
  formData.append("archivo", archivo);

  const res = await axios.post(`${API}/importar/validar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const guardarImportacion = async ({ ese_id, registros }) => {
  const res = await axios.post(`${API}/importar/guardar`, {
    ese_id,
    registros,
  });

  return res.data;
};