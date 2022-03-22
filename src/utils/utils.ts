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

export function hasNoRemainer(n: number, divisor: number) {
  if (n === 0 || divisor === 0) {
    return false; // cant divide by 0
  }

  return n % divisor === 0;
}
