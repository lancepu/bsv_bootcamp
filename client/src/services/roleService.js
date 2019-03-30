import http from "./httpService";

export function getRoles() {
  return http.get(`/api/role/all`);
}
