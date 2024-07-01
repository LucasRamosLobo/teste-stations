import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Paciente } from "../entity/Paciente";

export class PacienteController {
  static async cadastrarPaciente(req: Request, res: Response) {
    const { nome, cpf, dataNascimento } = req.body;

    const pacienteRepository = getRepository(Paciente);
    const paciente = pacienteRepository.create({
      nome,
      cpf,
      dataNascimento,
    });

    try {
      await pacienteRepository.save(paciente);
      res.status(201).json(paciente);
    } catch (error) {
      res.status(500).json({ error: "Erro ao cadastrar paciente." });
    }
  }

  static async listarPacientes(req: Request, res: Response) {
    const pacienteRepository = getRepository(Paciente);
    const pacientes = await pacienteRepository.find();
    res.json(pacientes);
  }
}
