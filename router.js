import { renderCars } from "./views/cars.js";
import { renderTrips } from "./views/trips.js";
import { renderDrivers } from "./views/drivers.js";
import { state, loadCars, loadTrips, loadDrivers } from "./state.js";

const routes = {
  "#/cars": { render: renderCars, load: loadCars, key: "cars" },
  "#/trips": { render: renderTrips, load: loadTrips, key: "trips", needs: ["cars", "drivers"] },
  "#/drivers": { render: renderDrivers, load: loadDrivers, key: "drivers" },
};

const loaders = { cars: loadCars, trips: loadTrips, drivers: loadDrivers };

export function renderRoute() {
  const hash = window.location.hash || "#/cars";
  const route = routes[hash] || routes["#/cars"];
  const activeHash = routes[hash] ? hash : "#/cars";

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.hash === activeHash);
  });

  route.render();

  if (state[route.key].status === "idle") {
    route.load();
  }
  for (const key of route.needs || []) {
    if (state[key].status === "idle") loaders[key]();
  }
}
