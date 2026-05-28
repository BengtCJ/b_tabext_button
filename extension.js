/**
 * b_tabext_button — Tableau Back Navigation Extension
 */

const PARAM_NAME = "Source Dashboard";

const btn = document.getElementById("back-btn");
const label = document.querySelector(".btn-label");
let sourceParam = null;

function waitForTableau(callback, retries = 20) {
  if (typeof tableau !== 'undefined') {
    callback();
  } else if (retries > 0) {
    setTimeout(() => waitForTableau(callback, retries - 1), 100);
  } else {
    console.error("[back-nav] Tableau API not available after 2s — is this loaded inside Tableau?");
    label.textContent = "API timeout";
    btn.disabled = false;
  }
}

waitForTableau(() => {

  tableau.extensions.initializeAsync().then(async () => {

    const workbook = tableau.extensions.workbook;

    // Debug: list all parameters in the workbook
    const allParams = await workbook.getParametersAsync();
    const paramNames = allParams.map(p => p.name).join(", ");
    console.log("[back-nav] Parameters found:", paramNames);

    // Show param names on button for debug
    label.textContent = paramNames || "NO PARAMS";
    btn.disabled = false;

    sourceParam = await workbook.findParameterAsync(PARAM_NAME);

    if (!sourceParam) {
      console.error(`[back-nav] "${PARAM_NAME}" not found. Found: ${paramNames}`);
      label.textContent = "Param missing";
      return;
    }

    label.textContent = "Back v6";
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

});

function updateTitle(destination) {
  btn.title = destination ? `Back to: ${destination}` : "No source set";
}
