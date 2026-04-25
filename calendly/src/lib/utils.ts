export function generateTimeSlots(
  startTimeStr: string, // "09:00"
  endTimeStr: string,   // "17:00"
  intervalMinutes: number = 15 // Default 15 minutes as requested
): string[] {
  const slots: string[] = [];
  const startSplit = startTimeStr.split(':');
  const endSplit = endTimeStr.split(':');
  
  const startHour = parseInt(startSplit[0]);
  const startMin = parseInt(startSplit[1]);
  const endHour = parseInt(endSplit[0]);
  const endMin = parseInt(endSplit[1]);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin <= endMin)) {
    // Format AM/PM
    const isPM = currentHour >= 12;
    const formattedHour = currentHour % 12 === 0 ? 12 : currentHour % 12;
    const formattedMin = currentMin.toString().padStart(2, '0');
    const ampm = isPM ? 'PM' : 'AM';
    
    slots.push(`${formattedHour.toString().padStart(2, '0')}:${formattedMin} ${ampm}`);
    
    currentMin += intervalMinutes;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }
  }
  
  return slots;
}
