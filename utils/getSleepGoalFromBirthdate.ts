export const getSleepGoalFromBirthdate = (birthDateString: string): string => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
  
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    if (age < 1) return '14–17 hours';
    if (age < 2) return '11–14 hours';
    if (age < 6) return '10–13 hours';
    if (age < 14) return '9–11 hours';
    if (age < 18) return '8–10 hours';
    if (age < 65) return '7–9 hours';
    return '7–8 hours';
  };
  