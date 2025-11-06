const BASE_URL = "https://sw-api.starnavi.io";

/** Get SW heroes */
export async function fetchHeroesPage(page = 1, limit = 10) {
  const res = await fetch(`${BASE_URL}/people?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch heroes page ${page}`);
  return res.json();
}

/** Get SW hero by ID */
export async function fetchHero(id: number | string) {
  const res = await fetch(`${BASE_URL}/people/${id}`);
  if (!res.ok) throw new Error(`Hero ${id} not found`);
  return res.json();
}

/** Get film by ID */
export async function fetchFilm(id: number | string) {
  const res = await fetch(`${BASE_URL}/films/${id}`);
  if (!res.ok) throw new Error(`Film ${id} not found`);
  return res.json();
}

/** Get starship by ID */
export async function fetchStarship(id: number | string) {
  const res = await fetch(`${BASE_URL}/starships/${id}`);
  if (!res.ok) throw new Error(`Starship ${id} not found`);
  return res.json();
}

/** Function to fetch array of resources by ID */
export async function fetchMultiple(
  type: "films" | "starships" | "people",
  ids: (string | number)[]
) {
  const promises = ids.map((id) => {
    const cleanId =
      typeof id === "string" && id.includes("/") ? id.split("/").pop() : id;
    return fetch(`${BASE_URL}/${type}/${cleanId}`).then((r) => {
      if (!r.ok) throw new Error(`${type} ${id} fetch failed`);
      return r.json();
    });
  });
  return Promise.all(promises);
}
