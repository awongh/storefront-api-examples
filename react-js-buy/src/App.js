import React, { useEffect, useState, useTransition, Suspense } from "react";



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
  const [isCartOpen,setCartOpen] = useState(null);
  const [checkout,setCheckout] = useState(wrapPromise(props.client.checkout.create()));
  const [shop,setShop] = useState(wrapPromise(props.client.shop.fetchInfo()));

  const [startCartTrans, cartIsPending] = useTransition({
    timeoutMs: 3000
  });

  const cartOpen = () => {
    setCartOpen( true );
  };

  // when the checkout changes, make sure the cart is open
  useEffect(() => {
    if( isCartOpen === null ){
      setCartOpen( false );
    }else if(isCartOpen === false){
      setCartOpen( true );
    }
  }, [checkout]);

  const addVariantToCart = (variantId, quantity) => {


    const lineItemsToAdd = [{variantId, quantity: parseInt(quantity, 10)}]
    const checkoutId = checkout.read().id
    startCartTrans(()=>{
      setCheckout(wrapPromise(props.client.checkout.addLineItems(checkoutId, lineItemsToAdd)))
    })
  }

  const updateQuantityInCart = (lineItemId, quantity) => {
    const checkoutId = checkout.read().id
    const lineItemsToUpdate = [{id: lineItemId, quantity: parseInt(quantity, 10)}]

    startCartTrans(()=>{
      //setCartOpen( true );
      setCheckout(wrapPromise(props.client.checkout.updateLineItems(checkoutId, lineItemsToUpdate)))
    })
  }

  const removeLineItemInCart = (lineItemId) => {
    const checkoutId = checkout.read().id

    startCartTrans(()=>{
      //setCartOpen( true );
      setCheckout(wrapPromise(props.client.checkout.removeLineItems(checkoutId, [lineItemId])))
    })
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
          cartIsPending={cartIsPending}
        />
        <Cart
          checkout={checkout}
          isCartOpen={isCartOpen}
          handleCartClose={handleCartClose}
          updateQuantityInCart={updateQuantityInCart}
          removeLineItemInCart={removeLineItemInCart}
          cartIsPending={cartIsPending}
        />
      </Suspense>
    </div>
  );
}

export default App;
