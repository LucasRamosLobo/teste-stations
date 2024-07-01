import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import medicoRoutes from "./Routes/MedicoRoutes";
import consultaRoutes from "./Routes/ConsultaRoutes";
import pacienteRoutes from "./Routes/PacienteRoutes";

const app = express();
app.use(express.json());

app.use("/medicos", medicoRoutes);
app.use("/consultas", consultaRoutes);
app.use("/pacientes", pacienteRoutes);

createConnection().then(async connection => {
  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
}).catch(error => console.log(error));