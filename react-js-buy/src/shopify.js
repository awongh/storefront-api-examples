import React, { useState, useEffect } from 'react';

import classnames from 'classnames';

import Client from 'shopify-buy';

import Products from './components/Products';
import Cart from './components/Cart';

import { createPortal } from "react-dom";

// promise retry
// pass an arrow function in - it doesnt handle params
function retry(fn, retriesLeft = 5, interval = 500) {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        console.log("caught errors!");

        if (retriesLeft === 0) {
          console.log("rejecting!");
          // reject('maximum retries exceeded');
          reject(error);
          return;
        }

        console.log("ab out to set error timeoput");

        setTimeout(() => {

          console.log("timed out, now we are calling again!!!!!!");
          console.log("retruies LEFT: "+retriesLeft);
          console.log("interVAL:L "+interval);
          // Passing on "reject" is the important part
          retry(fn, retriesLeft - 1, interval + 500).then(resolve, reject);
        }, interval);
      });
  });
}

const CartPortal = (props) => {

  const [modalContainer] = useState(document.createElement('div'));

  useEffect(() => {
    // Find the root element in your DOM
    let modalRoot = document.getElementById(props.appendId);

    // Append modal container to root
    modalRoot.appendChild(modalContainer);
    return function cleanup() {
      // On cleanup remove the modal container
      modalRoot.removeChild(modalContainer);
    };
  }, []); // <- The empty array tells react to apply the effect on mount/unmount

  let quantity = props.quantity > 0 ? props.quantity : '';

  const cart = (<div>
      <h2>{quantity}</h2>
      <button onClick={()=> props.setCartOpen(!props.isCartOpen)}>HELLO</button>
    </div>);

  return createPortal(cart, modalContainer);
};



function Shopify(props){

  const client = Client.buildClient({
    storefrontAccessToken: 'dd4d4dc146542ba7763305d71d1b3d38',
    domain: 'graphql.myshopify.com'
  });

  const [hasError,setError] = useState(false);
  const [totalQuantity,setTotalQuantity] = useState(0);
  const [doneLoading,setDoneLoading] = useState(false);
  const [products,setProducts] = useState([]);
  const [isCartOpen,setCartOpen] = useState(false);
  const [checkout,setCheckout] = useState({ lineItems: [] });
  const [shop,setShop] = useState({});

  const cartOpen = () => {
    setCartOpen( true );
  };

  useEffect(() => {
    let checkoutCreate = retry(()=> client.checkout.create() ).then((res) => {
      console.log("checkout create")
      setCheckout( res );
    });

    let productFetch = retry(()=> client.product.fetchAll() ).then((res) => {
      console.log("product fetch")
      setProducts( res );
    });

    let shopInfo = retry(()=> client.shop.fetchInfo() ).then((res) => {
      console.log("shop info")
      setShop(res);
    });

    Promise.all([checkoutCreate, productFetch, shopInfo]).then(()=>{
      console.log("all data ready");
      setDoneLoading(true);
    });

    // take the loader off the page
    document.querySelector('#shopify-loader').addEventListener('animationend', function(ev) {
      ev.target.style.display = "none";
      console.log("set appear thing");
    });

  }, []);

  const getTotalQuantity = (lineItems) => {
    let quantity = 0;
    lineItems.forEach((lineItem) => {
      quantity = quantity + lineItem.quantity;
    });

    return quantity;
  };

  const genericError = ()=>{
    setError( true );
  };

  const lineItemsCallback = (res)=>{
      console.log( res );

      let totalQuantity = getTotalQuantity( res.lineItems );
      setTotalQuantity( totalQuantity );

      setCheckout( res );
  };

  const addVariantToCart = (variantId, quantity, customAttributes) => {

    setCartOpen( true );

    const lineItemsToAdd = [{
      variantId,
      quantity: parseInt(quantity, 10),
      customAttributes
    }];

    const checkoutId = checkout.id;

    return retry(()=> client.checkout.addLineItems(checkoutId, lineItemsToAdd) )
      .then(lineItemsCallback)
      .catch(genericError);
  }

  const updateQuantityInCart = (lineItemId, quantity) => {
    const checkoutId = checkout.id
    const lineItemsToUpdate = [{id: lineItemId, quantity: parseInt(quantity, 10)}]

    return retry(() => client.checkout.updateLineItems(checkoutId, lineItemsToUpdate) )
      .then(lineItemsCallback)
      .catch(genericError);
  }

  const removeLineItemInCart = (lineItemId) => {
    const checkoutId = checkout.id

    return retry(()=> client.checkout.removeLineItems(checkoutId, [lineItemId]) )
      .then(lineItemsCallback)
      .catch(genericError);
  }

  const handleCartClose = () => {
    setCartOpen( false );
  }

  var loaderClass = classnames({
      loader:true,
      animated:doneLoading,
      fadeOut: doneLoading,
      faster: doneLoading
  });

  let loader = (<div id="shopify-loader" className={loaderClass}><img className="load-gif" src="https://cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif"/></div>);

  let appContents;

  if( doneLoading ){

    var appClass = classnames({
        hello:true,
        animated:doneLoading,
        fadeInDown: doneLoading,
        faster: doneLoading
    });

    appContents = (<div className={appClass}>
        <header className="App__header">
          {!isCartOpen &&
            <div className="App__view-cart-wrapper">
              <button className="App__view-cart" onClick={cartOpen}>Cart</button>
            </div>
          }
          <div className="App__title">
            <h1>shop name: {shop.name}</h1>
            <h2>desc: {shop.description}</h2>
          </div>
        </header>
        <Products
          products={products}
          client={client}
          addVariantToCart={addVariantToCart}
        />
      </div>);
  }

  let error;

  if( hasError ){
    error = <h1>ERROR</h1>;
  }

  return (
    <div className="App">
      {error}
      {appContents}
      {loader}
      <Cart
        doneLoading={doneLoading}
        checkout={checkout}
        isCartOpen={isCartOpen}
        handleCartClose={handleCartClose}
        updateQuantityInCart={updateQuantityInCart}
        removeLineItemInCart={removeLineItemInCart}
      />
      <CartPortal
        isCartOpen={isCartOpen}
        setCartOpen={setCartOpen}
        appendId="cart-btn-cont"
        quantity={totalQuantity}
      />
    </div>
  );
}

export default Shopify;
