export function isHoliday(date: Date): boolean {
    const holidays = [
      "2024-01-01", // Ano Novo
      "2024-12-25", // Natal
    ];
    const dateString = date.toISOString().split('T')[0];
    return holidays.includes(dateString);
  }