import http from "./httpService";

export function getLab() {
  return http.get(`/api/lab/all`);
}
