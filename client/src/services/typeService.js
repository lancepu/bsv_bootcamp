import http from "./httpService";

export function getType() {
  return http.get(`/api/type/all`);
}
