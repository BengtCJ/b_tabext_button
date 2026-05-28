# b_tabext_button

A minimal Tableau dashboard extension that provides a **Close / Back** navigation button. Reads a `Source Dashboard` parameter set by parent dashboards and returns the user to the correct one via the Tableau Extensions API.

---

## How It Works

1. Each parent dashboard sets two parameters via Parameter Actions when navigating to the child:
   - `Selected Chart` — your existing chart selector parameter
   - `Source Dashboard` — the exact tab name of that parent dashboard
2. The child dashboard hosts this extension in a zone
3. Clicking **Close** reads `Source Dashboard` and calls `activateSheetAsync()` to navigate back

---

## Tableau Setup

### 1. Create the Parameter

In your Tableau workbook, create a new parameter:

| Setting | Value |
|---|---|
| Name | `Source Dashboard` |
| Data type | String |
| Current value | *(leave blank or set to a default)* |
| Allowable values | All |

### 2. Add Parameter Actions to Every Parent Dashboard

For each parent dashboard, add a Parameter Action (Dashboard → Actions → Add Action → Change Parameter):

| Setting | Value |
|---|---|
| Run action on | Select (or your preferred trigger) |
| Target parameter | `Source Dashboard` |
| Value | Type the **exact tab name** of that dashboard |

Repeat for all 7+ parent dashboards.

### 3. Add the Extension to the Child Dashboard

- In Tableau Desktop: Dashboard → Extensions → My Extensions → browse to `b_tabext_button.trex`
- On Tableau Cloud: upload via the extension zone on the dashboard

---

## Hosting (GitHub Pages)

1. Push this repo to `github.com/BengtCJ/b_tabext_button`
2. Go to **Settings → Pages**
3. Set source to **Deploy from branch → main → / (root)**
4. Extension will be live at:
   `https://BengtCJ.github.io/b_tabext_button/index.html`

The `.trex` manifest already points to this URL.

---

## Local Development (Tableau Desktop)

To test locally before pushing:

1. Serve the folder on localhost — e.g. with VS Code Live Server or:
   ```bash
   npx serve .
   ```
2. Edit `b_tabext_button.trex` and temporarily change the URL to:
   ```
   http://localhost:3000/index.html
   ```
3. Tableau Desktop accepts `http://localhost` without HTTPS

Revert the URL before pushing for production.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Button UI |
| `extension.js` | Tableau API logic |
| `b_tabext_button.trex` | Tableau manifest — points to GitHub Pages URL |
| `README.md` | This file |

---

## Error Handling

- If the `Source Dashboard` parameter is missing from the workbook, the button renders as disabled with a console error
- If `activateSheetAsync` fails (e.g. mismatched sheet name), the error is logged to the browser console without crashing
- Hovering the button shows a tooltip with the current destination: *"Back to: Sales Dashboard"*
