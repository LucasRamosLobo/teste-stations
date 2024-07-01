import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Paciente } from "./Paciente";
import { Medico } from "./Medico";

@Entity()
export class Consulta {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Paciente)
  paciente!: Paciente;

  @ManyToOne(() => Medico)
  medico!: Medico;

  @Column()
  data!: Date;

  @Column()
  horario!: string; // Usar string para simplicidade, ex: '10:30'
}
