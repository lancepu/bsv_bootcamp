import http from "./httpService";

export function getSampleColor() {
  return http.get(`/api/samplecolor/all`);
}
