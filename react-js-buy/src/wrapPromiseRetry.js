function wrapPromise(promise) {
  let status = "pending";
  let currentErrorMessage = null;
  let result;
  let suspender = promise.then(
    r => {
      status = "success";
      result = r;
    },
    e => {
      console.log(`wrap`,e);
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        console.log( "THROWING SUSPENDER");
        console.log( suspender );
        throw suspender;
      } else if (status === "error") {
        if( result && result.message === 'Failed to fetch' ){

          throw suspender;

        }else{
          throw result;
        }
      } else if (status === "success") {
        console.log("RETTURN REEESULT",result)
        return result;
      }
    }
  };
}

var opts = {
  retries: 10,
  factor: 2,
  minTimeout: 1 * 100000,
  maxTimeout: Infinity,
};

function wrapPromiseRetry(retryCallback){

  // allow for setting state for a promise that will be set later.
  // but we still need to throw suspender above to keep using suspense
  if( retryCallback === undefined ){
    return wrapPromise(Promise.reject())
  }

  return wrapPromise(retry(retryCallback, opts))
}

function timeoutInterval(retriesLeft, opts) {
  var attempt = opts.retries - retriesLeft;
  var timeout = Math.round(opts.minTimeout * Math.pow(opts.factor, attempt));
  timeout = Math.min(timeout, opts.maxTimeout);
  return [timeout,attempt];
};

function retry(fn, opts, retriesLeft) {

  if( retriesLeft === undefined ){
    retriesLeft = opts.retries;
  }

  let [interval,attempt] = timeoutInterval( retriesLeft, opts );

  return new Promise((resolve, reject) => {

    // to check if the timeout has tripped
    let promiseTimedOut = false;

    let promiseTimeout = setTimeout(function(){
      promiseTimedOut = true;

      retry(fn, opts, retriesLeft - 1).then(resolve, reject);
    }, interval);

    // call the passed in function
    fn(attempt, interval)

      // it succeded
      .then(function(res){

        clearInterval( promiseTimeout );

        resolve(res);
      })
      // it failed
      .catch((error) => {

        // if we are waiting to time out fn, stop that, we failed
        if( promiseTimedOut === true ){
          reject(error);

          return;
        }

        clearInterval( promiseTimeout );

        // wait to retry
        setTimeout(() => {

          if (retriesLeft === 1) {
            // reject('maximum retries exceeded');
            reject(error);
            return;
          }

          // Passing on "reject" is the important part
          retry(fn, opts, retriesLeft - 1).then(resolve, reject);
        }, interval);
      });

  });
}


export default wrapPromiseRetry;
