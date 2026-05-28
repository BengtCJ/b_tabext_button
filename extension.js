/**
 * b_tabext_button — Tableau Back Navigation Extension
 * Reads the "Source Dashboard" parameter and navigates back to it on click.
 */

const PARAM_NAME = "Source Dashboard";

const btn = document.getElementById("back-btn");
const label = document.querySelector(".btn-label");
let sourceParam = null;

tableau.extensions.initializeAsync().then(async () => {

  const workbook = tableau.extensions.workbook;

  // Debug: list all parameters in the workbook
  const allParams = await workbook.getParametersAsync();
  const paramNames = allParams.map(p => p.name).join(", ");
  console.log("[back-nav] All parameters found:", paramNames);

  // Show param list on button temporarily for debug
  label.textContent = paramNames || "NO PARAMS";
  btn.disabled = false;

  sourceParam = await workbook.findParameterAsync(PARAM_NAME);

  if (!sourceParam) {
    console.error(`[back-nav] "${PARAM_NAME}" not found. Found: ${paramNames}`);
    label.textContent = "Param missing";
    return;
  }

  // Found — restore normal UI
  label.textContent = "Close";
  updateTitle(sourceParam.currentValue.value);

  sourceParam.addEventListener(
    tableau.TableauEventType.ParameterChanged,
    (event) => {
      event.getParameterAsync().then((param) => {
        updateTitle(param.currentValue.value);
      });
    }
  );

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
      label.textContent = "Nav failed";
    }
  });

}).catch((err) => {
  console.error("[back-nav] Init failed:", err);
  label.textContent = "Init failed";
  btn.disabled = false;
});

function updateTitle(destination) {
  btn.title = destination ? `Back to: ${destination}` : "No source set";
}
