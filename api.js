const API_BASE_URL = "http://localhost/JSlab7/api.php";

export class ApiRepository {
  #baseUrl;
  #type;

  constructor(baseUrl, type) {
    this.#baseUrl = baseUrl;
    this.#type = type;
  }

  async #request(query, options = {}) {
    const response = await fetch(`${this.#baseUrl}?type=${this.#type}${query}`, options);
    if (!response.ok) throw new Error(`Помилка сервера: ${response.status}`);
    return response.json();
  }

  async readAll() {
    return this.#request("");
  }

  async readById(id) {
    return this.#request(`&id=${id}`);
  }

  async create(item) {
    return this.#request("", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
  }

  async update(id, changes) {
    return this.#request(`&id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
  }

  async delete(id) {
    return this.#request(`&id=${id}`, { method: "DELETE" });
  }
}

export const carsApi = new ApiRepository(API_BASE_URL, "car_tvardovskyi");
export const tripsApi = new ApiRepository(API_BASE_URL, "trip_tvardovskyi");
export const driversApi = new ApiRepository(API_BASE_URL, "driver_tvardovskyi");
