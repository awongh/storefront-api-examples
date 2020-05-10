import React, { useEffect, useState, useTransition, Suspense } from "react";

import Product from './Product';

function Products(props) {
  const props_products = props.products.read();
  let products = props_products.map((product) => {
    return (
      <Product
        addVariantToCart={props.addVariantToCart}
        client={props.client}
        key={product.id.toString()}
        product={product}
        cartIsPending={props.cartIsPending}
      />
    );
  });

  return (
      <div className="Product-wrapper">
        {products}
      </div>
  );
}

function ProductList(props) {
  return (
    <Suspense fallback={<h1>Loading OMFFGGGGGGGG...</h1>}>
      <Products
        addVariantToCart={props.addVariantToCart}
        client={props.client}
        cartIsPending={props.cartIsPending}
        products={props.products}
      />
    </Suspense>
  );
}

export default ProductList;
