import http from "./httpService";

export function getSpecimen() {
  return http.get(`/api/specimen/all`);
}
