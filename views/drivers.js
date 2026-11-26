import {
  state, createDriver, updateDriver, deleteDriver,
  startEditingDriver, startCreatingDriver, closeDriverForm,
} from "../state.js";
import { renderTable } from "../components/table.js";
import { renderForm, renderPanelHead } from "../components/form.js";

const columns = [
  { key: "id", label: "ID" },
  { key: "fullName", label: "ПІБ" },
  { key: "personnelNumber", label: "Табельний номер" },
  { key: "category", label: "Категорія" },
];

const fields = [
  { name: "fullName", label: "ПІБ" },
  { name: "personnelNumber", label: "Табельний номер" },
  { name: "category", label: "Категорія" },
];

export function renderDrivers() {
  const container = document.querySelector("#app");
  const { items, status, error, editingId, formOpen } = state.drivers;

  if (status === "loading" || status === "idle") {
    container.innerHTML = "<p class='info'>Завантаження...</p>";
    return;
  }
  if (status === "error") {
    container.innerHTML = `<p class='info error'>Помилка: ${error}</p>`;
    return;
  }

  container.innerHTML = "";
  renderPanelHead(container, "Водії", "+ Додати водія", startCreatingDriver);

  if (formOpen) {
    const editing = items.find(d => String(d.id) === String(editingId));
    renderForm(container, {
      title: editing ? `Редагування водія #${editingId}` : "Новий водій",
      fields,
      values: editing || {},
      onSubmit: data => (editing ? updateDriver(editingId, data) : createDriver(data)),
      onCancel: closeDriverForm,
    });
  }

  renderTable(container, items, columns, { onEdit: startEditingDriver, onDelete: deleteDriver });
}
