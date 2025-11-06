import axios from "axios";

const API = axios.create({
  baseURL: "https://webalmacenbackend.onrender.com/api",
});

export const getProductos = async (page = 1, limit = 10) => {
  const { data } = await API.get(`/productos?limit=${limit}&page=${page}`);
  return data;
};
