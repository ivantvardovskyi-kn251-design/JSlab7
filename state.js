import { renderRoute } from "./router.js";
import { carsApi, tripsApi, driversApi } from "./api.js";

const emptyState = () => ({ items: [], status: "idle", error: null, editingId: null, formOpen: false });

export const state = {
  cars: emptyState(),
  trips: emptyState(),
  drivers: emptyState(),
};

function makeActions(key, api) {
  const s = () => state[key];

  async function load() {
    s().status = "loading";
    renderRoute();
    try {
      s().items = await api.readAll();
      s().status = "success";
      s().error = null;
    } catch (error) {
      s().status = "error";
      s().error = error.message;
    }
    renderRoute();
  }

  async function create(data) {
    await api.create(data);
    s().formOpen = false;
    await load();
  }

  async function update(id, data) {
    await api.update(id, data);
    s().editingId = null;
    s().formOpen = false;
    await load();
  }

  async function remove(id) {
    await api.delete(id);
    await load();
  }

  function startEditing(id) {
    s().editingId = id;
    s().formOpen = true;
    renderRoute();
  }

  function startCreating() {
    s().editingId = null;
    s().formOpen = true;
    renderRoute();
  }

  function closeForm() {
    s().editingId = null;
    s().formOpen = false;
    renderRoute();
  }

  return { load, create, update, remove, startEditing, startCreating, closeForm };
}

export const {
  load: loadCars, create: createCar, update: updateCar, remove: deleteCar,
  startEditing: startEditingCar, startCreating: startCreatingCar, closeForm: closeCarForm,
} = makeActions("cars", carsApi);

export const {
  load: loadTrips, create: createTrip, update: updateTrip, remove: deleteTrip,
  startEditing: startEditingTrip, startCreating: startCreatingTrip, closeForm: closeTripForm,
} = makeActions("trips", tripsApi);

export const {
  load: loadDrivers, create: createDriver, update: updateDriver, remove: deleteDriver,
  startEditing: startEditingDriver, startCreating: startCreatingDriver, closeForm: closeDriverForm,
} = makeActions("drivers", driversApi);
