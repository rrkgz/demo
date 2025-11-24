import express from "express";
import db from "./config/db";
import router from "./router";
import cors, { CorsOptions } from "cors";
import dotenv from 'dotenv';
dotenv.config(); 

const server = express(); 

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"), false);
    }
  },
  credentials: true, // Si usas cookies o headers personalizados
};
server.use(cors(corsOptions));

server.use(express.json());

// Ruta directa
server.post('/crear-cuenta', (req, res) => {
  const { email, password } = req.body;
  res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
});

// Conectar base de datos
async function conectarBD() {
  try {
    await db.authenticate();
    await db.sync();
    console.log("Conexión a BD exitosa");
  } catch (error) {
    console.log("No se pudo conectar a la BD");
    console.log(error);
  }
}
conectarBD();



// Rutas externas
server.use("/api", router);


export default server;