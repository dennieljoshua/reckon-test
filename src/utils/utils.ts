import axios from "axios";

const instance = axios.create({
  baseURL: "https://join.reckon.com",
  timeout: 10000,
});

instance.interceptors.response.use(undefined, (error) => {
  if (error.config && error.response && error.response.status > 500) {
    return new Promise((resolve) =>
      setTimeout(() => resolve(instance(error.config)), 500)
    );
  }

  return Promise.reject(error);
});

export const reckonClient = instance;

export function createRangeArray(start: number, end: number) {
  const arr = Array(end - start + 1);
  return Array.apply(null, arr).map((_, n) => n + start);
}

export function hasNoRemainder(n: number, divisor: number) {
  if (n === 0 || divisor === 0) {
    return false; // cant divide by 0
  }

  return n % divisor === 0;
}

// Algo from this youtuber, Thanks! youtuber https://www.youtube.com/watch?v=I5vWuso82jA
// Adapted it a bit so it works with an array of words to search
export function stringSearch(textToSearch: string, subTexts: Array<string>) {
  const resultsDictionary: { [subText: string]: Array<string> } = {};

  for (const subText of subTexts) {
    const normalized: string = subText.toLocaleLowerCase();

    for (let i = 0; i < textToSearch.length; i++) {
      for (let j = 0; j < normalized.length; j++) {
        const subChar = normalized[j];

        if (subChar !== textToSearch[i + j]) {
          break;
        }

        if (j === normalized.length - 1) {
          if (!Array.isArray(resultsDictionary[subText])) {
            resultsDictionary[subText] = [];
          }
          resultsDictionary[subText].push(`${i + 1}`); // +1 because index starts at 0 but text search starts with 1
        }
      }
    }

    // No match
    if (!Array.isArray(resultsDictionary[subText])) {
      resultsDictionary[subText] = ["<No Output>"];
    }
  }

  return resultsDictionary;
}
