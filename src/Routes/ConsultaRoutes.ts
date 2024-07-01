import { Router } from "express";
import { ConsultaController } from "../Controller/ConsultaController";

const router = Router();
router.post("/", ConsultaController.cadastrarConsulta);
router.get("/medico/:id", ConsultaController.listarConsultasPorMedico);
router.get("/paciente/:id", ConsultaController.listarConsultasPorPaciente);
export default router;