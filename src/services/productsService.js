import axios from "axios";

const API = axios.create({
  baseURL: "https://webalmacenbackend.onrender.com/api",
});

export const getProductos = async () => {
  const { data } = await API.get("/productos");
  return data;
};
