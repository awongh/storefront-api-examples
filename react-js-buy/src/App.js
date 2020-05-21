import React, {
  useState,
  useEffect,
  useTransition,
  Suspense
} from "react";

import Products from './components/Products';
import Cart from './components/Cart';

import wrapPromiseRetry from './wrapPromiseRetry'

import Client from 'shopify-buy';

const client = Client.buildClient({
  storefrontAccessToken: 'dd4d4dc146542ba7763305d71d1b3d38',
  domain: 'graphql.myshopify.com'
});

let checkoutId;

function App(props){


  const [checkoutPending,setCheckoutPending] = useState(false);
  const [attempts,setAttempts] = useState(0);
  const [isCartOpen,setCartOpen] = useState(false);
  const [checkout,setCheckout] = useState(wrapPromiseRetry());

  const [
    startTransition,
    isPending
  ] = useTransition({
    timeoutMs: 10000
  });

  const cartOpen = () => {
    setCartOpen( true );
  };

  const handleCartClose = () => {
    setCartOpen( false );
  }

  useEffect(() => {

    const checkoutResource = wrapPromiseRetry(function(attempt, interval){
      console.log(`attempting: ${attempt} ** interval: ${interval}`);
      setAttempts( attempt)
      return client.checkout.create().then((res)=>{
        console.log( res.id);
        checkoutId = res.id;
        return res
      });
    });

    setCheckout(checkoutResource);

  }, []);

  const addVariantToCart = (variantId, quantity) => {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log(checkoutId);
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

    // open the cart
    setCartOpen( true );

    // disable the buttons
    setCheckoutPending(true);

    // format data
    const lineItemsToAdd = [{variantId, quantity: parseInt(quantity, 10)}]

    const checkoutPromise = wrapPromiseRetry(function(attempt, interval){
      console.log(`ADD VARIANT attempting: ${attempt} ** interval: ${interval}`);
      setAttempts( attempt)
      return client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((res)=>{

        setCheckoutPending(false);
        return res;
      })
    });

    setCheckout(checkoutPromise);

  }

  const updateQuantityInCart = (lineItemId, quantity) => {
    setCartOpen( true );
    setCheckoutPending(true);

    const lineItemsToUpdate = [{id: lineItemId, quantity: parseInt(quantity, 10)}]

    const checkoutPromise = wrapPromiseRetry(function(attempt, interval){
      console.log(`UPDATE CART attempting: ${attempt} ** interval: ${interval}`);
      setAttempts( attempt)
      return client.checkout.updateLineItems(checkoutId, lineItemsToUpdate).then(res => {
        setCheckoutPending(false);
        return res;
      });

    });

      setCheckout(checkoutPromise);

  }

  const removeLineItemInCart = (lineItemId) => {

    setCartOpen( true );
    setCheckoutPending(true);

    const checkoutPromise = wrapPromiseRetry(function(attempt, interval){
      console.log(`UPDATE CART attempting: ${attempt} ** interval: ${interval}`);
      setAttempts( attempt)

      return client.checkout.removeLineItems(checkoutId, [lineItemId]).then(res => {
        setCheckoutPending(false);
        return res;
      });

    });

    setCheckout(checkoutPromise);
  }

  return (
    <div className="App">
        <header className="App__header">
          <h1>attemptz: {attempts}</h1>
          {!isCartOpen &&
            <div className="App__view-cart-wrapper">
              <button className="App__view-cart" onClick={cartOpen}>Cart</button>
            </div>
          }
          <div className="App__title">
            <h1>React Example</h1>
          </div>
        </header>
        <Suspense
          fallback={<h2>Loading postz...</h2>}
        >
          <Cart
            checkoutPending={checkoutPending}
            setCheckoutPending={setCheckoutPending}
            checkout={checkout}
            isCartOpen={isCartOpen}
            handleCartClose={handleCartClose}
            updateQuantityInCart={updateQuantityInCart}
            removeLineItemInCart={removeLineItemInCart}
          />
        </Suspense>
       <Products
          checkoutPending={checkoutPending}
          client={client}
          addVariantToCart={addVariantToCart}
        />
      </div>
  );
}

export default App;
