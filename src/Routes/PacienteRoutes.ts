import { Router } from "express";
import { PacienteController } from "../Controller/PacienteController";

const router = Router();
router.post("/", PacienteController.cadastrarPaciente);
router.get("/", PacienteController.listarPacientes);
export default router;
