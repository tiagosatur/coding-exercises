const BASE_URL = import.meta.env.VITE_JIKAN_BASE_URL;


const retryFetching = async (fn, maxRetries) => {
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= maxRetries) throw err;

      attempt++;
      await new Promise((r) => setTimeout(r, 1000 * attempt))
    }
  }
}

const addDelay = async (time) => {
  await new Promise((resolve) => setTimeout(resolve, time));
}

export async function fetchPeople({ query }) {
  return retryFetching(async () => {
    await addDelay(2000);
    const res = await fetch(`${BASE_URL}/people?q=${query}`)

    if (!res.ok) throw new Error("Failed to fetch people");

    return res.json();
  }, 3)

}
