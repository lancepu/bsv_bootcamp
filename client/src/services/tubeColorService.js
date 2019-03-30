import http from "./httpService";

export function getTubeColor() {
  return http.get(`/api/tubecolor/all`);
}
