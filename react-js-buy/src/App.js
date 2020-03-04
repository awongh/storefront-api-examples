import React, { useState, Suspense } from "react";


import Products from './components/Products';
import Cart from './components/Cart';


function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    r => {
      status = "success";
      result = r;
    },
    e => {
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

function Header(props){

  const my_shop = props.shop.read();

  return (
        <header className="App__header">
          {!props.isCartOpen &&
            <div className="App__view-cart-wrapper">
              <button className="App__view-cart" onClick={props.cartOpen}>Cart</button>
            </div>
          }
          <div className="App__title">
            <h1>{my_shop.name}: React Example</h1>
            <h2>{my_shop.description}</h2>
          </div>
        </header>)
}

function App(props){

  const [products,setProducts] = useState(wrapPromise(props.client.product.fetchAll()));
  const [isCartOpen,setCartOpen] = useState(false);
  const [checkout,setCheckout] = useState(wrapPromise(props.client.checkout.create()));
  const [shop,setShop] = useState(wrapPromise(props.client.shop.fetchInfo()));

  const cartOpen = () => {
    setCartOpen( true );
  };

  const addVariantToCart = (variantId, quantity) => {

    setCartOpen( true );

    const lineItemsToAdd = [{variantId, quantity: parseInt(quantity, 10)}]
    const checkoutId = checkout.id

    return props.client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(res => {
      setCheckout( res );
    });
  }

  const updateQuantityInCart = (lineItemId, quantity) => {
    const checkoutId = checkout.id
    const lineItemsToUpdate = [{id: lineItemId, quantity: parseInt(quantity, 10)}]

    return props.client.checkout.updateLineItems(checkoutId, lineItemsToUpdate).then(res => {
      setCheckout( res );
    });
  }

  const removeLineItemInCart = (lineItemId) => {
    const checkoutId = checkout.id

    return props.client.checkout.removeLineItems(checkoutId, [lineItemId]).then(res => {

      setCheckout( res );
    });
  }

  const handleCartClose = () => {

    setCartOpen( false );
  }

  return (
    <div className="App">
      <Suspense fallback={<h1>Loading OMFFGGGGGGGG...</h1>}>
        <Header isCartOpen={isCartOpen} cartOpen={cartOpen} shop={shop}/>
        <Products
          products={products}
          client={props.client}
          addVariantToCart={addVariantToCart}
        />
        <Cart
          checkout={checkout}
          isCartOpen={isCartOpen}
          handleCartClose={handleCartClose}
          updateQuantityInCart={updateQuantityInCart}
          removeLineItemInCart={removeLineItemInCart}
        />
      </Suspense>
    </div>
  );
}

export default App;
