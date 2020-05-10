// todo:
// when the component is waiting for the cart, suspend INSIDE the cart.
// messaging is that we are retrying and we are waiting.....
// suspended state of the cart is a spinner????



import React, { useEffect, useState, useTransition, Suspense } from "react";
import promiseRetry from 'promise-retry';

import ProductList from './components/ProductList';
import Cart from './components/Cart';

import Client from 'shopify-buy';

const PRETRY_SETTINGS = {
    retries:10,
    factor:5,
    minTimeout:1000,
    maxTimeout:20000,
    randomize:false
};

const client = Client.buildClient({
  storefrontAccessToken: 'dd4d4dc146542ba7763305d71d1b3d38',
  domain: 'graphql.myshopify.com'
});

function wrapPromise(promise, successCb) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    r => {
      if( typeof successCb === "function" ){
        successCb();
      }
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
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}

function wrapPromiseRetry(retryCallback, successCallback){
  return wrapPromise(promiseRetry(retryCallback, PRETRY_SETTINGS), successCallback)
}

function Header(props){
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$ HEADER");
  console.log( props );
  console.log( props.checkout );
  console.log( props.checkout.read );
  console.log( props.checkout.read() );

  const checkout = props.checkout.read();
  return (
        <header className="App__header">
          {!props.isCartOpen &&
            <div className="App__view-cart-wrapper">
              <button disabled={props.cartIsPending} className="App__view-cart" onClick={props.cartOpen}>Cart {checkout.lineItems.length}</button>
            </div>
          }
          <div className="App__title">
            <h1>React Example</h1>
            <h2>Sweet</h2>
          </div>
        </header>)
}

function Store(props){

  const [isCartOpen,setCartOpen] = useState(null);
  const [cartIsPending,setCartPending] = useState(false);
  const [checkout,setCheckout] = useState(props.initCheckout);

  const [startCartTrans, papaya] = useTransition({
    timeoutMs: 100000
  });

  const cartOpen = () => {
    setCartOpen( true );
  };

  // when the checkout changes, make sure the cart is open
  /*
  useEffect(() => {
    console.log("USE EFFECT CHECKOUT", checkout);
    setCartPending(!cartIsPending);
    if( isCartOpen === null ){
      setCartOpen( false );
    }else if(isCartOpen === false){
      setCartOpen( true );
    }
  }, [checkout]);
  */

  const toggleCart = ()=>{
    console.log("HJEYOOOO", cartIsPending);
    //setCartPending(!cartIsPending);
    setCartPending(false);
    setCartOpen( !isCartOpen );
  };

  const addVariantToCart = (variantId, quantity) => {
    setCartPending(true);

    const lineItemsToAdd = [{variantId, quantity: parseInt(quantity, 10)}]
    const checkoutId = checkout.read().id

    const retryCallback = (retry, number)=>{
      console.log("*************** ADD VARIANT INSIDE RETRIE");
      console.log(number);

      return client.checkout.addLineItems(checkoutId, lineItemsToAdd).catch(retry)
    };

    setCheckout(wrapPromiseRetry(retryCallback, toggleCart))
  }

  const updateQuantityInCart = (lineItemId, quantity) => {
    setCartPending(true);
    const checkoutId = checkout.read().id
    const lineItemsToUpdate = [{id: lineItemId, quantity: parseInt(quantity, 10)}]
    console.log("THE SHIT!!!!!!!!!!!!!!!!!!!!!!!")

    const retryCallback = (retry, number)=>{
      console.log("*************** iupdate VARIANT INSIDE RETRIE");
      console.log(number);

      return client.checkout.updateLineItems(checkoutId, lineItemsToUpdate).catch(retry)
    };

    setCheckout(wrapPromiseRetry(retryCallback, toggleCart))
  }

  const removeLineItemInCart = (lineItemId) => {
    setCartPending(true);
    const checkoutId = checkout.read().id

    const retryCallback = (retry, number)=>{
      console.log("*************** iupdate VARIANT INSIDE RETRIE");
      console.log(number);

      return client.checkout.removeLineItems(checkoutId, [lineItemId]).catch(retry)
    };

    setCheckout(wrapPromiseRetry(retryCallback, toggleCart))
  }

  const handleCartClose = () => {

    setCartOpen( false );
  }
  console.log(`IS POENDDDINNGGG ${cartIsPending}`, checkout)
  return (
    <div className="App">
        <ProductList
          products={props.products}
          client={client}
          addVariantToCart={addVariantToCart}
          cartIsPending={cartIsPending}
        />
          <Cart
            updateLineItems={client.checkout.updateLineItems.bind(client.checkout)}
            setCheckout={setCheckout}
            checkout={checkout}
            isCartOpen={isCartOpen}
            handleCartClose={handleCartClose}
            updateQuantityInCart={updateQuantityInCart}
            removeLineItemInCart={removeLineItemInCart}
            cartIsPending={cartIsPending}
          />
    </div>
  );
}

function App(props){

  const checkoutRetryCallback = (retry, number)=>{
    console.log("*************** checkout create VARIANT INSIDE RETRIE");
    console.log(number);

    return client.checkout.create().catch(retry)
  };

  const initCheckout = wrapPromiseRetry(checkoutRetryCallback)


  const productsRetryCallback = (retry, number)=>{
    console.log("*************** products fetchall VARIANT INSIDE RETRIE");
    console.log(number);

    return client.product.fetchAll().catch(retry)
  };

  const products = wrapPromiseRetry(productsRetryCallback)

  const shopRetryCallback = (retry, number)=>{
    console.log("*************** products fetchall VARIANT INSIDE RETRIE");
    console.log(number);

    return client.shop.fetchInfo().catch(retry)
  };

  const shop = wrapPromiseRetry(shopRetryCallback)

  return(<Suspense fallback={<h1 className="bananas">HEY SOMETHING</h1>}>
    <Store
      products={products}
      initCheckout={initCheckout}
      shop={shop}
    />
  </Suspense>)
}

export default App;
