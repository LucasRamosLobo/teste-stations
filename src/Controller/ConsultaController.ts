import { Request, Response } from "express";
import { getRepository, Between } from "typeorm";
import { Consulta } from "../entity/Consulta";
import { Medico } from "../entity/Medico";
import { Paciente } from "../entity/Paciente";
import { isHoliday } from "../utils/holidayChecker";
import { validateWorkingHours } from "../utils/workingHoursValidator";

export class ConsultaController {
  static async cadastrarConsulta(req: Request, res: Response) {
    const { pacienteId, medicoId, data, horario, duracao } = req.body;

    const consultaRepository = getRepository(Consulta);
    const medicoRepository = getRepository(Medico);
    const pacienteRepository = getRepository(Paciente);

    try {

      const medico = await medicoRepository.findOne({ where: { id: medicoId } });
      if (!medico) {
        return res.status(404).json({ error: "Médico não encontrado." });
      }
      const paciente = await pacienteRepository.findOne({ where: { id: pacienteId } });
      if (!paciente) {
        return res.status(404).json({ error: "Paciente não encontrado." });
      }
      if (isHoliday(new Date(data))) {
        return res.status(400).json({ error: "Não é permitido cadastrar consultas em feriados." });
      }
      if (!validateWorkingHours(medico, new Date(data), horario, duracao)) {
        return res.status(400).json({ error: "Horário fora do expediente do médico." });
      }

      const horarioFinal = new Date(`${data}T${horario}`);
      horarioFinal.setMinutes(horarioFinal.getMinutes() + duracao);
      const conflitos = await consultaRepository.find({
        where: {
          medico,
          data,
          horario: Between(horario, horarioFinal.toISOString().split('T')[1])
        }
      });

      if (conflitos.length > 0) {
        return res.status(400).json({ error: "Conflito de horário com outra consulta." });
      }

      const consulta = consultaRepository.create({
        paciente,
        medico,
        data,
        horario,
        duracao
      });
      await consultaRepository.save(consulta);
      res.status(201).json(consulta);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Erro ao cadastrar consulta: ${error.message}`, error);
      } else {
        console.error(`Erro ao cadastrar consulta: ${error}`);
      }
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
