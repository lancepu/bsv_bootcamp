import http from "./httpService";

export function getVisualInspect() {
  return http.get(`/api/visualinspect/all`);
}
