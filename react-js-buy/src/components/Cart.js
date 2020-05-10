import React from 'react';

import LineItem from './LineItem';


// craete a suspense here for the buttons????
// a wrapper component to trigger the suspense????
// we need to be able to show the notification here and not suspend the whole component or it wont appear on the page ata ll - it will disappear.

function Cart(props){

  const checkout = props.checkout.read();

  console.log(":::::::::::::::::::::::::::::::::::");
  console.log(":::::::::::::::::::::::::::::::::::");
  console.log(":::::::::::::::::::::::::::::::::::");
  console.log(":::::::::::::::::::::::::::::::::::");
  console.log(":::::::::::::::::::::::::::::::::::");
  console.log(checkout);
  console.log(checkout.updateLineItems);
  console.log(":::::::::::::::::::::::::::::::::::");
  console.log(":::::::::::::::::::::::::::::::::::");
  console.log(":::::::::::::::::::::::::::::::::::");

  const openCheckout = () => {
    window.open(checkout.webUrl);
  }

  let line_items = checkout.lineItems.map((line_item) => {
    console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU props checkout",props.checkout)

    return (
      <LineItem
        setCheckout={props.setCheckout}
        checkout={checkout}
        ff={props.checkout}
        cartIsPending={props.cartIsPending}
        updateQuantityInCart={props.updateQuantityInCart}
        removeLineItemInCart={props.removeLineItemInCart}
        updateLineItems={props.updateLineItems}
        key={line_item.id.toString()}
        line_item={line_item}
      />
    );
  });

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
        <button disabled={props.cartIsPending} className="Cart__checkout button" onClick={openCheckout}>Checkout</button>
      </footer>
    </div>
  )
}

export default Cart;
