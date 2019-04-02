import React, { useState, useEffect } from 'react';

import Client from 'shopify-buy';

import Products from './components/Products';
import Cart from './components/Cart';

function App(props){

  const client = Client.buildClient({
    storefrontAccessToken: 'dd4d4dc146542ba7763305d71d1b3d38',
    domain: 'graphql.myshopify.com'
  });

  const [products,setProducts] = useState([]);
  const [isCartOpen,setCartOpen] = useState(false);
  const [checkout,setCheckout] = useState({ lineItems: [] });
  const [shop,setShop] = useState({});

  const cartOpen = () => {
    setCartOpen( true );
  };

  useEffect(() => {
    let checkoutCreate = client.checkout.create().then((res) => {
      console.log("checkout create")
      setCheckout( res );
    });

    let productFetch = client.product.fetchAll().then((res) => {
      console.log("product fetch")
      setProducts( res );
    });

    let shopInfo = client.shop.fetchInfo().then((res) => {
      console.log("shop info")
      setShop(res);
    });

    Promise.all([checkoutCreate, productFetch, shopInfo]).then(()=>{
      console.log("all data ready");
    });

  }, []);

  const addVariantToCart = (variantId, quantity) => {

    setCartOpen( true );

    const lineItemsToAdd = [{variantId, quantity: parseInt(quantity, 10)}]
    const checkoutId = checkout.id

    return client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(res => {
      setCheckout( res );
    });
  }

  const updateQuantityInCart = (lineItemId, quantity) => {
    const checkoutId = checkout.id
    const lineItemsToUpdate = [{id: lineItemId, quantity: parseInt(quantity, 10)}]

    return client.checkout.updateLineItems(checkoutId, lineItemsToUpdate).then(res => {
      setCheckout( res );
    });
  }

  const removeLineItemInCart = (lineItemId) => {
    const checkoutId = checkout.id

    return client.checkout.removeLineItems(checkoutId, [lineItemId]).then(res => {

      setCheckout( res );
    });
  }

  const handleCartClose = () => {

    setCartOpen( false );
  }

  return (
    <div className="App">
        <header className="App__header">
          {!isCartOpen &&
            <div className="App__view-cart-wrapper">
              <button className="App__view-cart" onClick={cartOpen}>Cart</button>
            </div>
          }
          <div className="App__title">
            <h1>{shop.name}: React Example</h1>
            <h2>{shop.description}</h2>
          </div>
        </header>
        <Products
          products={products}
          client={client}
          addVariantToCart={addVariantToCart}
        />
        <Cart
          checkout={checkout}
          isCartOpen={isCartOpen}
          handleCartClose={handleCartClose}
          updateQuantityInCart={updateQuantityInCart}
          removeLineItemInCart={removeLineItemInCart}
        />
      </div>
  );
}

export default App;
