/**
 * b_tabext_button — Tableau Back Navigation Extension
 * Reads the "Source Dashboard" parameter and navigates back to it on click.
 */

const PARAM_NAME = "Source Dashboard";

const btn = document.getElementById("back-btn");
let sourceParam = null;

tableau.extensions.initializeAsync().then(async () => {

  const workbook = tableau.extensions.workbook;

  // Find the Source Dashboard parameter
  sourceParam = await workbook.findParameterAsync(PARAM_NAME);

  if (!sourceParam) {
    console.error(`[back-nav] Parameter "${PARAM_NAME}" not found in workbook.`);
    btn.title = `Parameter "${PARAM_NAME}" not found`;
    return;
  }

  // Enable the button now we have a valid parameter
  btn.disabled = false;
  updateTitle(sourceParam.currentValue.value);

  // Keep title in sync if parameter changes
  sourceParam.addEventListener(
    tableau.TableauEventType.ParameterChanged,
    (event) => {
      event.getParameterAsync().then((param) => {
        updateTitle(param.currentValue.value);
      });
    }
  );

  // Navigate on click
  btn.addEventListener("click", async () => {
    const destination = sourceParam.currentValue.value;

    if (!destination) {
      console.warn("[back-nav] Source Dashboard parameter is empty.");
      return;
    }

    try {
      await workbook.activateSheetAsync(destination);
    } catch (err) {
      console.error(`[back-nav] Could not navigate to "${destination}":`, err);
    }
  });

}).catch((err) => {
  console.error("[back-nav] Failed to initialise extension:", err);
});

function updateTitle(destination) {
  btn.title = destination ? `Back to: ${destination}` : "No source set";
}
