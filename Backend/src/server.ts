import express from "express";
import db from "./config/db";
import router from "./router";
import cors, { CorsOptions } from "cors";
import dotenv from 'dotenv';
dotenv.config(); 

const server = express(); 

// CORS simplificado para desarrollo
server.use(cors({
  origin: true,
  credentials: true
}));

server.use(express.json());

// Eliminar rutas directas duplicadas; usar únicamente router /api

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