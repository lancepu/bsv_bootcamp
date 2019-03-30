import http from "./httpService";

const apiEndpoint = `/api/sample`;
const verifyEndpoint = `/api/sample/verify`;
const ppvEndpoint = `/api/sample/ppv`;
const printEndpoint = "/api/sample/print";
const printCSVEndPoint = "/api/sample/printcsv";

function sampleUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getSample(sampleId) {
  return http.get(sampleUrl(sampleId));
}

export function printSample(sampleId) {
  return http.get(`${printEndpoint}/${sampleId}`);
}

export function submitSample(sample) {
  return http.post(apiEndpoint, {
    labno: sample.labno,
    specimen_id: sample.specimen,
    submit_user_id: sample.user,
    lab_id: sample.lab
  });
}

export function querySample(query) {
  return http.get(sampleUrl(query));
}

export function verifySample(sample) {
  return http.put(verifyEndpoint, {
    labno: sample.labno,
    preprocess_comment: sample.preprocessComment,
    preprocess_volume: sample.preprocessVolume,
    verify_user_id: sample.user,
    tube_color_id: sample.tubeColor,
    visual_inspect_id: sample.visualInspect
  });
}

export function ppvSample(sample) {
  return http.put(ppvEndpoint, {
    labno: sample.labno,
    postprocess_comment: sample.postprocessComment,
    postprocess_volume: sample.postprocessVolume,
    sample_color_id: sample.sampleColor,
    ppv_user_id: sample.user,
    transparency_id: sample.transparency,
    type_id: sample.type
  });
}

export function editSample(sample) {
  return http.put(sampleUrl(sample.id), {
    id: sample.id,
    labno: sample.labno,
    specimen_id: sample.specimen,
    preprocess_comment: sample.preprocessComment,
    preprocess_volume: sample.preprocessVolume,
    tube_color_id: sample.tubeColor,
    visual_inspect_id: sample.visualInspect,
    postprocess_comment: sample.postprocessComment,
    postprocess_volume: sample.postprocessVolume,
    sample_color_id: sample.sampleColor,
    transparency_id: sample.transparency,
    type_id: sample.type
  });
}

export function printCSV(fileName, data) {
  return http.post(printCSVEndPoint, {
    fileName,
    data
  });
}

export default {
  getSample,
  submitSample,
  verifySample,
  ppvSample,
  editSample,
  printSample,
  printCSV,
  querySample
};
