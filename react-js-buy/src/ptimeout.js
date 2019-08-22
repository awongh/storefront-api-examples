function withTimeout(promise, timeout){
    const timeoutPromise = new Promise((resolve, reject) =>
        setTimeout(
          () => {
            return reject(`Timed out after ${timeout} ms.`)
          },
            timeout));
    return Promise.race([
        promise,
        timeoutPromise
    ]);
};

// promise retry
// pass an arrow function in - it doesnt handle params
function retry(fn, retriesLeft = 5, interval = 500, initialTimeout = 15000) {

  return new Promise((resolve, reject) => {

    withTimeout(fn(), initialTimeout)
      .then(resolve)
      .catch((error) => {
        console.log("caught errors!");
        console.log( error );

        if (retriesLeft === 0) {
          console.log("rejecting!");
          reject('maximum retries exceeded', error);
          return;
        }

        console.log("ab out to set error timeoput");

        setTimeout(() => {

          // TODO: try to connet this to sentry
          console.log(`timed out. retries left: ${retriesLeft} : interval: ${interval}`);
          // Passing on "reject" is the important part
          retry(fn, retriesLeft - 1, interval + 500, initialTimeout).then(resolve, reject);
        }, interval);
    });
  });
}

export default retry;
