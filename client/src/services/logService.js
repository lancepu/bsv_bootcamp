// import Raven from "raven-js";

function init() {
  //   Raven.config(
  //     "https://cd9a28e5d192424fb575defaf5f40603@sentry.io/1380342"
  //   ).install();
}

function log(error) {
  console.error(error);
  //   Raven.captureException(error);
}

export default { init, log };
