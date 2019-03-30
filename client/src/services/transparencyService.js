import http from "./httpService";

export function getTransparency() {
  return http.get(`/api/transparency/all`);
}
