import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Consulta } from "../entity/Consulta";
import { Medico } from "../entity/Medico";
import { Paciente } from "../entity/Paciente";

export class ConsultaController {
  static async cadastrarConsulta(req: Request, res: Response) {
    const { pacienteId, medicoId, data, horario } = req.body;

    const consultaRepository = getRepository(Consulta);
    const medicoRepository = getRepository(Medico);
    const pacienteRepository = getRepository(Paciente);

    try {
      const medico = await medicoRepository.findOne(medicoId);
      const paciente = await pacienteRepository.findOne(pacienteId);

      if (!medico || !paciente) {
        return res.status(404).json({ error: "Médico ou Paciente não encontrado." });
      }

      // Validar se o horário está dentro do expediente do médico
      // Validar se não há conflito com outras consultas
      const consultasNoHorario = await consultaRepository.find({
        where: { medico: medico, data: data, horario: horario }
      });

      if (consultasNoHorario.length > 0) {
        return res.status(400).json({ error: "Horário já está ocupado." });
      }

      const consulta = consultaRepository.create({
        paciente: paciente,
        medico: medico,
        data: data,
        horario: horario
      });

      await consultaRepository.save(consulta);
      res.status(201).json(consulta);
    } catch (error) {
      res.status(500).json({ error: "Erro ao cadastrar consulta." });
    }
  }

  static async listarConsultasPorMedico(req: Request, res: Response) {
    const { id } = req.params;
    const consultaRepository = getRepository(Consulta);

    try {
      const consultas = await consultaRepository.find({
        where: { medico: { id: Number(id) } },
        relations: ["paciente", "medico"]
      });
      res.json(consultas);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar consultas." });
    }
  }

  static async listarConsultasPorPaciente(req: Request, res: Response) {
    const { id } = req.params;
    const consultaRepository = getRepository(Consulta);

    try {
      const consultas = await consultaRepository.find({
        where: { paciente: { id: Number(id) } },
        relations: ["paciente", "medico"]
      });
      res.json(consultas);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar consultas." });
    }
  }
}

