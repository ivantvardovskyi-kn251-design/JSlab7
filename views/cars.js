import {
  state, createCar, updateCar, deleteCar, startEditingCar, startCreatingCar, closeCarForm,
} from "../state.js";
import { renderTable } from "../components/table.js";
import { renderForm, renderPanelHead } from "../components/form.js";

const columns = [
  { key: "id", label: "ID" },
  { key: "plate", label: "Номер" },
  { key: "brand", label: "Марка" },
  { key: "capacity", label: "Вантажність, т" },
  { key: "fuelPer100", label: "Витрата, л/100 км" },
];

const fields = [
  { name: "plate", label: "Номер" },
  { name: "brand", label: "Марка" },
  { name: "capacity", label: "Вантажність, т", type: "number", step: "0.1" },
  { name: "fuelPer100", label: "Витрата палива, л/100 км", type: "number", step: "0.1" },
];

export function renderCars() {
  const container = document.querySelector("#app");
  const { items, status, error, editingId, formOpen } = state.cars;

  if (status === "loading" || status === "idle") {
    container.innerHTML = "<p class='info'>Завантаження...</p>";
    return;
  }
  if (status === "error") {
    container.innerHTML = `<p class='info error'>Помилка: ${error}</p>`;
    return;
  }

  container.innerHTML = "";
  renderPanelHead(container, "Автомобілі", "+ Додати автомобіль", startCreatingCar);

  if (formOpen) {
    const editing = items.find(c => String(c.id) === String(editingId));
    renderForm(container, {
      title: editing ? `Редагування автомобіля #${editingId}` : "Новий автомобіль",
      fields,
      values: editing || {},
      onSubmit: data => (editing ? updateCar(editingId, data) : createCar(data)),
      onCancel: closeCarForm,
    });
  }

  renderTable(container, items, columns, { onEdit: startEditingCar, onDelete: deleteCar });
}
