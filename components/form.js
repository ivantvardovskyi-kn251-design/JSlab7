export function renderForm(container, { title, fields, values = {}, onSubmit, onCancel }) {
  const section = document.createElement("div");
  section.className = "form-section";

  const h3 = document.createElement("h3");
  h3.className = "form-title";
  h3.textContent = title;
  section.append(h3);

  const form = document.createElement("form");

  for (const field of fields) {
    const label = document.createElement("label");
    label.textContent = field.label;

    let input;
    if (field.options) {
      input = document.createElement("select");
      for (const opt of field.options) {
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.label;
        input.append(option);
      }
    } else {
      input = document.createElement("input");
      input.type = field.type || "text";
      if (field.step) input.step = field.step;
    }
    input.name = field.name;
    input.required = true;
    if (values[field.name] !== undefined) input.value = values[field.name];

    label.append(input);
    form.append(label);
  }

  const actions = document.createElement("div");
  actions.className = "form-actions";
  actions.innerHTML = `
    <button type="submit" class="primary">Зберегти</button>
    <button type="button" class="cancel-btn">Скасувати</button>
  `;
  form.append(actions);

  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = {};
    for (const field of fields) {
      const raw = form.elements[field.name].value;
      data[field.name] = field.type === "number" || field.numeric ? Number(raw) : raw;
    }
    onSubmit(data);
  });
  actions.querySelector(".cancel-btn").addEventListener("click", onCancel);

  section.append(form);
  container.append(section);
}

export function renderPanelHead(container, title, addLabel, onAdd) {
  const head = document.createElement("div");
  head.className = "panel-head";
  head.innerHTML = `<h2>${title}</h2>`;
  const btn = document.createElement("button");
  btn.className = "primary";
  btn.textContent = addLabel;
  btn.addEventListener("click", onAdd);
  head.append(btn);
  container.append(head);
}
