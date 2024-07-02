import { Medico } from "../entity/Medico";

export function validateWorkingHours(medico: Medico, date: Date, startTime: string, duration: number): boolean {
    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = startHour + Math.ceil(duration / 60);
  
    const workStart = 8;
    const workEnd = 18;
  
    return startHour >= workStart && endHour <= workEnd;
  }