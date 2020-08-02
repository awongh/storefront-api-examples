import React, { useContext } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { CheckoutContext } from "../CheckoutContext";
import { CartOpenContext } from "../CartOpenContext";
import Product from './Product';

import {
  shopProducts,
} from './shop';

import {
  useCheckoutEffect,
  checkoutLineItemsAdd,
} from '../checkout';

function Products(props){

  const [isCartOpen, setCartOpen] = useContext(CartOpenContext);
  const [checkout, setCheckout] = useContext(CheckoutContext);

  const [lineItemAddMutation,
  {
    data: lineItemAddData,
    loading: lineItemAddLoading,
    error: lineItemAddError
  }] = useMutation(checkoutLineItemsAdd);

  const { loading:productsLoading, error:productsError, data:productsData } = useQuery(shopProducts);

  useCheckoutEffect(lineItemAddData, 'checkoutLineItemsAdd', setCheckout);

  const addVariantToCart = (variantId, quantity) =>{
    const variables = { checkoutId:checkout.id, lineItems:  [{variantId, quantity: parseInt(quantity, 10)}] };
    // TODO replace for each mutation in the checkout thingy. can we export them from there???
    // create your own custom hook???

    lineItemAddMutation({ variables }).then(res => {
        setCartOpen(true);
    });
  };

  if (productsLoading) {
    return <p>Products Loading ...</p>;
  }

  if (productsError) {
    return <p>{productsError.message}</p>;
  }

  return (
    <div className="Product-wrapper">
      { productsData.shop.products.edges.map(product =>
        <Product addVariantToCart={addVariantToCart} checkout={checkout} key={product.node.id.toString()} product={product.node} />
      )}
    </div>
  );
}

export default Products;
