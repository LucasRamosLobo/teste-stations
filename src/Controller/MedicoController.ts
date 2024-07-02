import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Medico } from "../entity/Medico";

export class MedicoController {
  static async cadastrarMedico(req: Request, res: Response) {
    const { nome, crm, especialidade } = req.body;
    console.log('nome')
    const medicoRepository = getRepository(Medico);
    const medico = medicoRepository.create({ nome, crm, especialidade });

    try {
      await medicoRepository.save(medico);
      res.status(201).json(medico);
    } catch (error) {
      res.status(500).json({ error: "Erro ao cadastrar médico." });
    }
  }

  static async listarMedicos(req: Request, res: Response) {
    const medicoRepository = getRepository(Medico);
    const medicos = await medicoRepository.find();
    res.json(medicos);
  }
}
