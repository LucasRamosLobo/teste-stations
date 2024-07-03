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
        console.log(`Médico com ID: ${medicoId} não encontrado.`);
        return res.status(404).json({ error: "Médico não encontrado." });
      }

      console.log(`Buscando paciente com ID: ${pacienteId}`);
      const paciente = await pacienteRepository.findOne({ where: { id: pacienteId } });
      if (!paciente) {
        console.log(`Paciente com ID: ${pacienteId} não encontrado.`);
        return res.status(404).json({ error: "Paciente não encontrado." });
      }

      console.log(`Verificando se a data é um feriado: ${data}`);
      if (isHoliday(new Date(data))) {
        console.log(`A data ${data} é um feriado.`);
        return res.status(400).json({ error: "Não é permitido cadastrar consultas em feriados." });
      }

      console.log(`Verificando horário de trabalho do médico`);
      if (!validateWorkingHours(medico, new Date(data), horario, duracao)) {
        console.log(`Horário fora do expediente do médico.`);
        return res.status(400).json({ error: "Horário fora do expediente do médico." });
      }

      const horarioFinal = new Date(`${data}T${horario}`);
      horarioFinal.setMinutes(horarioFinal.getMinutes() + duracao);

      console.log(`Verificando conflitos de horário`);
      const conflitos = await consultaRepository.find({
        where: {
          medico,
          data,
          horario: Between(horario, horarioFinal.toISOString().split('T')[1])
        }
      });

      if (conflitos.length > 0) {
        console.log(`Conflito de horário com outra consulta.`);
        return res.status(400).json({ error: "Conflito de horário com outra consulta." });
      }

      console.log(`Criando consulta`);
      const consulta = consultaRepository.create({
        paciente,
        medico,
        data,
        horario,
        duracao
      });

      console.log(`Salvando consulta no banco de dados`);
      await consultaRepository.save(consulta);
      console.log(`Consulta criada com sucesso: ${JSON.stringify(consulta)}`);
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
