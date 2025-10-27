import axios from "axios";

const API = axios.create({
  baseURL: "https://webalmacenbackend.onrender.com/api",
});

// 🧾 Enviar pedido a la base de datos
export const enviarPedido = async (pedido) => {
  const { data } = await API.post("/pedidos", pedido);
  return data;
};
