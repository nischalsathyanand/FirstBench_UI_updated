function convertAndSortDates(dateArray) {
  // Convert date strings to Date objects
  const dateObjects = dateArray.map((dateString) => {
    const parts = dateString.match(/(\d{2})([A-Za-z]{3})(\d{4})/);
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const monthIndex = monthNames.indexOf(parts[2].toUpperCase());
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[3], 10);
    return new Date(year, monthIndex, day);
  });

  // Sort the Date objects
  dateObjects.sort((a, b) => a - b);

  // Format the dates to DD/MM/YY
  const formattedDates = dateObjects.map((date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  });

  return formattedDates;
}
export default convertAndSortDates;
