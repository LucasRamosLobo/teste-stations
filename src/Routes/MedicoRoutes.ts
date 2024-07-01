import { Router } from "express";
import { MedicoController } from "../Controller/MedicoController";

const router = Router();
router.get("/", MedicoController.listarMedicos);
export default router;