import React, { useState } from 'react';
import Cart from './components/Cart';
import Products from './components/Products';
import { CheckoutProvider } from "./CheckoutContext";
import { CartOpenProvider } from "./CartOpenContext";

function App(props){

  return (
    <div className="App">
      <CheckoutProvider>
        <CartOpenProvider>
          <Products
          />
          <Cart
          />
        </CartOpenProvider>
      </CheckoutProvider>
    </div>
  );

}

export default App;
