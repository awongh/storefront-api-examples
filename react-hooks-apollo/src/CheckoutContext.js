import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
  useCheckoutEffect,
  createCheckout,
} from './checkout';

const CheckoutContext = React.createContext([{}, () => {}]);

const CheckoutProvider = (props) => {

  const [checkout,setCheckout] = useState({ lineItems: { edges: [] }});

  const [createCheckoutMutation,
  {
    data: createCheckoutData,
    loading: createCheckoutLoading,
    error: createCheckoutError
  }] = useMutation(createCheckout);

  useEffect(() => {
    const variables = { input: {} };
    createCheckoutMutation({ variables }).then(
      res => {
        console.log( res );
      },
      err => {
        console.log('create checkout error', err );
      }
    );

  }, []);

  useCheckoutEffect(createCheckoutData, 'checkoutCreate', setCheckout);

  return (
    <CheckoutContext.Provider value={[checkout, setCheckout]}>
      {props.children}
    </CheckoutContext.Provider>
  );
}

export { CheckoutContext, CheckoutProvider };
