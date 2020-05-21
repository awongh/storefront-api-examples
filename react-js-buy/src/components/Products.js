import React, {
  useState,
  useEffect,
  useTransition,
  Suspense
} from "react";

import wrapPromiseRetry from '../wrapPromiseRetry'

import Product from './Product';

function Products(props) {


  const [products,setProducts] = useState(wrapPromiseRetry());
  const [attempts,setAttempts] = useState(0);

  useEffect(() => {

    const productsResource = wrapPromiseRetry(function(attempt, interval){
      console.log(`attempting: ${attempt} ** interval: ${interval}`);
      setAttempts( attempt)
      return props.client.product.fetchAll();
    });

    setProducts(productsResource);

  }, []);


  return (
    <div className="Product-wrapper">
      <Suspense
          fallback={<h2>Gettingg Produckts</h2>}
      >
      <ProductList
        addVariantToCart={props.addVariantToCart}
        checkoutPending={props.checkoutPending}
        client={props.client}
        products={products}
      />
      </Suspense>
    </div>
  );
}

function ProductList(props) {

  const variantForOptions = props.client.product.helpers.variantForOptions;
  return (
    <>
      { props.products.read().map((product) => {
        return (
          <Product
            checkoutPending={props.checkoutPending}
            variantForOptions={variantForOptions}
            addVariantToCart={props.addVariantToCart}
            client={props.client}
            key={product.id.toString()}
            product={product}
          />
        );
      })}
    </>
  )
}


export default Products;
