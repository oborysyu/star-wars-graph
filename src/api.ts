const BASE_URL = 'https://sw-api.starnavi.io';

// --- caching to prevent 429 error ---
const cache = new Map<string, any>();

async function cachedFetch(url: string) {
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const data = await res.json();
  cache.set(url, data);
  return data;
}

// --- Limiting the number of simultaneous requests ---
async function throttleAll<T>(
  urls: string[],
  limit = 3,
  fetchFn = (url: string) => cachedFetch(url)
): Promise<T[]> {
  const results: T[] = [];
  let active = 0;
  let index = 0;

  return new Promise((resolve, reject) => {
    const processNext = () => {
      if (index >= urls.length && active === 0) {
        resolve(results);
        return;
      }

      while (active < limit && index < urls.length) {
        const url = urls[index++];
        active++;

        fetchFn(url)
          .then((data) => results.push(data))
          .catch((err) => console.error('Fetch failed:', err))
          .finally(() => {
            active--;
            processNext();
          });
      }
    };

    processNext();
  });
}

// --- API functions ---

export async function fetchHeroesPage(page = 1, limit = 10) {
  const url = `${BASE_URL}/people?page=${page}&limit=${limit}`;
  return cachedFetch(url);
				
}

						
export async function fetchHero(id: number | string) {
  const url = `${BASE_URL}/people/${id}`;
  return cachedFetch(url);
					
}

					 
export async function fetchFilm(id: number | string) {
  const url = `${BASE_URL}/films/${id}`;
  return cachedFetch(url);
					
}

						 
export async function fetchStarship(id: number | string) {
  const url = `${BASE_URL}/starships/${id}`;
  return cachedFetch(url);
					
}

/** Function to fetch array of resources by ID */
export async function fetchMultiple(
  type: 'films' | 'starships' | 'people',
  ids: (string | number)[],
  concurrency = 3
) {
  const urls = ids
    .filter(Boolean)
    .map((id) => {
      const cleanId =
        typeof id === 'string' && id.includes('/')
          ? id.split('/').pop()
          : id;
      return `${BASE_URL}/${type}/${cleanId}`;
															   
					  
    });

  return throttleAll(urls, concurrency);
}
