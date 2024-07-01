import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Medico } from "../entity/Medico";

export class MedicoController {
  static async listarMedicos(req: Request, res: Response) {
    const medicoRepository = getRepository(Medico);
    const medicos = await medicoRepository.find();
    res.json(medicos);
  }
}