import {
  state, createTrip, updateTrip, deleteTrip, startEditingTrip, startCreatingTrip, closeTripForm,
} from "../state.js";
import { renderTable } from "../components/table.js";
import { renderForm, renderPanelHead } from "../components/form.js";

const carLabel = id => {
  const car = state.cars.items.find(c => c.id === Number(id));
  return car ? `${car.brand} (${car.plate})` : `#${id}`;
};
const driverLabel = id => {
  const d = state.drivers.items.find(x => x.id === Number(id));
  return d ? d.fullName : `#${id}`;
};

const columns = [
  { key: "id", label: "ID" },
  { key: "carId", label: "Автомобіль", format: t => carLabel(t.carId) },
  { key: "driverId", label: "Водій", format: t => driverLabel(t.driverId) },
  { key: "departureDate", label: "Виїзд" },
  { key: "returnDate", label: "Повернення" },
  { key: "distance", label: "Відстань, км" },
  { key: "origin", label: "Звідки" },
  { key: "destination", label: "Куди" },
  { key: "cargo", label: "Вантаж" },
  { key: "status", label: "Статус" },
];

function buildFields() {
  const statuses = ["заплановано", "в дорозі", "завершено", "скасовано"];
  return [
    { name: "carId", label: "Автомобіль", numeric: true,
      options: state.cars.items.map(c => ({ value: c.id, label: `${c.brand} (${c.plate})` })) },
    { name: "driverId", label: "Водій", numeric: true,
      options: state.drivers.items.map(d => ({ value: d.id, label: d.fullName })) },
    { name: "departureDate", label: "Дата виїзду", type: "date" },
    { name: "returnDate", label: "Дата повернення", type: "date" },
    { name: "distance", label: "Відстань, км", type: "number" },
    { name: "origin", label: "Пункт відправлення" },
    { name: "destination", label: "Пункт призначення" },
    { name: "cargo", label: "Вантаж" },
    { name: "status", label: "Статус рейсу", options: statuses.map(s => ({ value: s, label: s })) },
  ];
}

export function renderTrips() {
  const container = document.querySelector("#app");
  const { items, status, error, editingId, formOpen } = state.trips;

  if (status === "loading" || status === "idle") {
    container.innerHTML = "<p class='info'>Завантаження...</p>";
    return;
  }
  if (status === "error") {
    container.innerHTML = `<p class='info error'>Помилка: ${error}</p>`;
    return;
  }

  container.innerHTML = "";
  renderPanelHead(container, "Рейси", "+ Додати рейс", startCreatingTrip);

  if (formOpen) {
    const editing = items.find(t => String(t.id) === String(editingId));
    renderForm(container, {
      title: editing ? `Редагування рейсу #${editingId}` : "Новий рейс",
      fields: buildFields(),
      values: editing || {},
      onSubmit: data => (editing ? updateTrip(editingId, data) : createTrip(data)),
      onCancel: closeTripForm,
    });
  }

  renderTable(container, items, columns, { onEdit: startEditingTrip, onDelete: deleteTrip });
}
