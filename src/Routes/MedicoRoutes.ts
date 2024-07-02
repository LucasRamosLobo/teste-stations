import { Router } from "express";
import { MedicoController } from "../Controller/MedicoController";

const router = Router();
router.post("/", MedicoController.cadastrarMedico);
router.get("/", MedicoController.listarMedicos);
export default router;