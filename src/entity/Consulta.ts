import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Paciente } from "./Paciente";
import { Medico } from "./Medico";

@Entity()
export class Consulta {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Paciente, { eager: true })
  paciente!: Paciente;

  @ManyToOne(() => Medico, { eager: true })
  medico!: Medico;

  @Column()
  data!: Date;

  @Column()
  horario!: string;

  @Column()
  duracao!: number;
}