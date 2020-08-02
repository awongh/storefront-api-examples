import React, { useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';

import {
  useCheckoutEffect,
  checkoutLineItemsUpdate,
  checkoutLineItemsRemove
} from '../checkout';

import LineItem from './LineItem';

import { CheckoutContext } from "../CheckoutContext";
import { CartOpenContext } from "../CartOpenContext";

function Cart(props){

  const [checkout, setCheckout] = useContext(CheckoutContext);
  const [isCartOpen, setCartOpen] = useContext(CartOpenContext);

  const [lineItemUpdateMutation,
  {
    data: lineItemUpdateData,
    loading: lineItemUpdateLoading,
    error: lineItemUpdateError
  }] = useMutation(checkoutLineItemsUpdate);

  const [lineItemRemoveMutation,
  {
    data: lineItemRemoveData,
    loading: lineItemRemoveLoading,
    error: lineItemRemoveError
  }] = useMutation(checkoutLineItemsRemove);

  useCheckoutEffect(lineItemUpdateData, 'checkoutLineItemsUpdate', setCheckout);
  useCheckoutEffect(lineItemRemoveData, 'checkoutLineItemsRemove', setCheckout);

  const updateLineItemInCart = (lineItemId, quantity) => {
    const variables = { checkoutId:checkout.id, lineItems: [{id: lineItemId, quantity: parseInt(quantity, 10)}] };
    lineItemUpdateMutation({ variables });
  };

  const removeLineItemInCart = (lineItemId) => {
    const variables = { checkoutId:checkout.id, lineItemIds: [lineItemId] };
    lineItemRemoveMutation({ variables });
  };

  const openCheckout = () => {
    window.open(checkout.webUrl);
  }

  let line_items = checkout.lineItems.edges.map((line_item) => {
    return (
      <LineItem
        removeLineItemInCart={removeLineItemInCart}
        updateLineItemInCart={updateLineItemInCart}
        key={line_item.node.id.toString()}
        line_item={line_item.node}
      />
    );
  });

  return (
    <div className={`Cart ${isCartOpen ? 'Cart--open' : ''}`}>
      <header className="Cart__header">
        <h2>Your cart</h2>
        <button
          onClick={()=>setCartOpen(false)}
          className="Cart__close">
          ×
        </button>
      </header>
      <ul className="Cart__line-items">
        {line_items}
      </ul>
      <footer className="Cart__footer">
        <div className="Cart-info clearfix">
          <div className="Cart-info__total Cart-info__small">Subtotal</div>
          <div className="Cart-info__pricing">
            <span className="pricing">$ {checkout.subtotalPrice}</span>
          </div>
        </div>
        <div className="Cart-info clearfix">
          <div className="Cart-info__total Cart-info__small">Taxes</div>
          <div className="Cart-info__pricing">
            <span className="pricing">$ {checkout.totalTax}</span>
          </div>
        </div>
        <div className="Cart-info clearfix">
          <div className="Cart-info__total Cart-info__small">Total</div>
          <div className="Cart-info__pricing">
            <span className="pricing">$ {checkout.totalPrice}</span>
          </div>
        </div>
        <button className="Cart__checkout button" onClick={openCheckout}>Checkout</button>
      </footer>
    </div>
  )
}

export default Cart;
