import axios from "axios";

const API = "http://localhost:3001";

export const validarImportacionCatalogo = async (archivo) => {
  const formData = new FormData();
  formData.append("archivo", archivo);

  const res = await axios.post(
    `${API}/catalogo/importar/validar`,
    formData
  );

  return res.data;
};

export const guardarImportacionCatalogo = async (registros) => {
  const res = await axios.post(`${API}/catalogo/importar/guardar`, {
    registros,
  });

  return res.data;
};