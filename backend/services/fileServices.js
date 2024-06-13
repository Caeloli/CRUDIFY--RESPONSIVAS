/*const responsiveFileController = require("../controller/responsiveFileController");
async function checkExpirationDates() {
  try {
    // Fetch all responsive files from the database
    const responsives =
      await responsiveFileController.getAllResponsiveFiles();

    // Filter the responsive files where end_date - CURRENT_DATE <= 30
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const filteredResponsives = responsives.filter((responsive) => {
      const endDateDiff =
        (responsive.end_date - currentDate) / (1000 * 60 * 60 * 24); // Difference in days
      return (
        endDateDiff <= 30 && endDateDiff >= 0 && responsive.state_id_fk === 2
      );
    });

    return filteredResponsives;
  } catch (error) {
    console.error("Error fetching and filtering expiration dates:", error);
    throw error;
  }
}


module.exports = {
  checkExpirationDates,
};
*/