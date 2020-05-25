import React, {
  useState,
  useEffect,
  useTransition,
  Suspense
} from "react";

import LineItem from './LineItem';

function LineItemList(props){

  const checkout = props.checkout.read();

  return (<div>
    {checkout.lineItems.map((lineItem) => {
      return (
        <LineItem
          checkoutPending={props.checkoutPending}
          updateQuantityInCart={props.updateQuantityInCart}
          removeLineItemInCart={props.removeLineItemInCart}
          key={lineItem.id.toString()}
          lineItem={lineItem}
        />
      );
    })}

        </div>);
}

function CheckoutFooter(props){

  const checkout = props.checkout.read();

  const openCheckout = () => {
    window.open(checkout.webUrl);
  }

  return (
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
        <button
          className="Cart__checkout button"
          onClick={openCheckout}
          disabled={props.checkoutPending}
        >Checkout</button>
      </footer>
  );
};

function Cart(props){


  return (
    <div className={`Cart ${props.isCartOpen ? 'Cart--open' : ''}`}>
      <header className="Cart__header">
        <h2>Your cart</h2>
        <button
          onClick={props.handleCartClose}
          className="Cart__close">
          ×
        </button>
      </header>
      <ul className="Cart__line-items">

        <Suspense
          fallback={<h2>CCart Itemsssssss...</h2>}
        >
          <LineItemList
              checkoutPending={props.checkoutPending}
              checkout={props.checkout}
              updateQuantityInCart={props.updateQuantityInCart}
          />
        </Suspense>
      </ul>

        <Suspense
          fallback={<h2>FOOTERERERERERE...</h2>}
        >
      <CheckoutFooter
        checkoutPending={props.checkoutPending}
        checkout={props.checkout}
      />
        </Suspense>
    </div>
  )
}

export default Cart;
