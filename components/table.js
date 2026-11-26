export function renderTable(container, items, columns, { onEdit, onDelete }) {
  if (items.length === 0) {
    const p = document.createElement("p");
    p.textContent = "Записів немає";
    container.append(p);
    return;
  }

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");

  columns.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col.label;
    headRow.append(th);
  });
  const actionsTh = document.createElement("th");
  actionsTh.textContent = "Дії";
  headRow.append(actionsTh);
  thead.append(headRow);
  table.append(thead);

  const tbody = document.createElement("tbody");
  for (const item of items) {
    tbody.append(renderRow(item, columns));
  }
  table.append(tbody);

  table.addEventListener("click", event => {
    const id = event.target.dataset.id;
    if (!id) return;
    if (event.target.classList.contains("edit-btn")) onEdit(id);
    if (event.target.classList.contains("delete-btn")) {
      if (confirm(`Видалити запис #${id}?`)) onDelete(id);
    }
  });

  container.append(table);
}

export function renderRow(item, columns) {
  const tr = document.createElement("tr");

  columns.forEach(col => {
    const td = document.createElement("td");
    td.textContent = col.format ? col.format(item) : item[col.key];
    tr.append(td);
  });

  const actionsTd = document.createElement("td");
  actionsTd.innerHTML = `
    <button class="edit-btn" data-id="${item.id}">Редагувати</button>
    <button class="delete-btn" data-id="${item.id}">Видалити</button>
  `;
  tr.append(actionsTd);
  return tr;
}
