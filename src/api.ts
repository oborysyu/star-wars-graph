/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = 'https://sw-api.starnavi.io';
const cache = new Map<string, any>();

const REQUEST_DELAY = 200;

let lastRequestTime = 0;

async function rateLimitedFetch(url: string) {
  const now = Date.now();
  const diff = now - lastRequestTime;

  if (diff < REQUEST_DELAY) {
    await new Promise((r) => setTimeout(r, REQUEST_DELAY - diff));
  }

  lastRequestTime = Date.now();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}: ${url}`);
  return res.json();
}


export async function fetchHeroesPage(page = 1) {
  const url = `${API_BASE}/people/?page=${page}`;
  if (cache.has(url)) return cache.get(url);

  const data = await rateLimitedFetch(url);
  cache.set(url, data);
  return data;
}

export async function fetchHero(id: string | number) {
  const url = `${API_BASE}/people/${id}`;
  if (cache.has(url)) return cache.get(url);

  const data = await rateLimitedFetch(url);
  cache.set(url, data);
  return data;
}

export async function fetchFilm(id: string | number) {
  const url = `${API_BASE}/films/${id}`;
  if (cache.has(url)) return cache.get(url);

  const data = await rateLimitedFetch(url);
  cache.set(url, data);
  return data;
}

export async function fetchStarship(id: string | number) {
  const url = `${API_BASE}/starships/${id}`;
  if (cache.has(url)) return cache.get(url);

  const data = await rateLimitedFetch(url);
  cache.set(url, data);
  return data;
}

export async function fetchMultiple(
  type: 'films' | 'starships' | 'people',
  ids: (string | number)[]
) {
  const results = [];

  for (const id of ids) {
    if (!id) continue;

    const url = `${API_BASE}/${type}/${id}`;
    if (cache.has(url)) {
      results.push(cache.get(url));
      continue;
    }

    try {
      const data = await rateLimitedFetch(url);
      cache.set(url, data);
      results.push(data);
    } catch (err) {
      console.warn(`Skipping failed fetch for ${url}:`, err);
    }
  }

  return results;
}
