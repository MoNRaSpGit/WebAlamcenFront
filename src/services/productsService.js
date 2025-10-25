import axios from "axios";

const API = axios.create({
  baseURL: "https://webalmacenbackend.onrender.com/api", // tu backend en Render
});

export const getProductos = async () => {
  const { data } = await API.get("/productos");
  return data;
};
