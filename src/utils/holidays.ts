
// List of Mauritian public holidays for 2025
export const getMauritianHolidays = (year = 2025): { date: Date; name: string }[] => {
  // Fixed date holidays
  const fixedHolidays = [
    { date: new Date(year, 0, 1), name: "New Year's Day" },
    { date: new Date(year, 0, 2), name: "New Year's Day (2nd Day)" },
    { date: new Date(year, 1, 1), name: "Thaipoosam Cavadee" },
    { date: new Date(year, 1, 20), name: "Maha Shivaratree" },
    { date: new Date(year, 2, 12), name: "Independence Day" },
    { date: new Date(year, 2, 31), name: "Ougadi" },
    { date: new Date(year, 4, 1), name: "Labour Day" },
    { date: new Date(year, 10, 2), name: "Arrival of Indentured Labourers" },
    { date: new Date(year, 10, 4), name: "Divali" },
    { date: new Date(year, 11, 25), name: "Christmas Day" },
    // Add movable religious holidays (approximate dates for 2025)
    { date: new Date(year, 3, 18), name: "Eid-Ul-Fitr" },
    { date: new Date(year, 6, 25), name: "Eid-Ul-Adha" },
    { date: new Date(year, 7, 15), name: "Ganesh Chaturthi" },
    { date: new Date(year, 9, 24), name: "All Saints Day" },
  ];

  return fixedHolidays;
};

// Check if a date is a public holiday
export const isPublicHoliday = (date: Date): { isHoliday: boolean; holidayName?: string } => {
  const holidays = getMauritianHolidays(date.getFullYear());
  
  const holiday = holidays.find(h => 
    h.date.getDate() === date.getDate() && 
    h.date.getMonth() === date.getMonth()
  );
  
  return holiday 
    ? { isHoliday: true, holidayName: holiday.name } 
    : { isHoliday: false };
};
