import React from 'react';

import classnames from 'classnames';

import LineItem from './LineItem';

function Cart(props){

  const openCheckout = () => {
    window.open(props.checkout.webUrl);
  }

  let line_items = props.checkout.lineItems.map((line_item) => {
    return (
      <LineItem
        loaded={!props.cartItemLoading}
        updateQuantityInCart={props.updateQuantityInCart}
        removeLineItemInCart={props.removeLineItemInCart}
        key={line_item.id.toString()}
        line_item={line_item}
      />
    );
  });

  const lineItemClass = classnames({
      "line-item-cont":true,

      animated:true,

      // we need to keep track of things that are about to be loaded (the array of items is pushed from within the lib)
      blank:!props.cartItemLoader,
      fadeIn: props.cartItemLoader,
      fadeOutDown: !props.cartItemLoading,
  });

  const cartLoading = <li className={lineItemClass}></li>;

  return (
    <div className={`Cart ${props.isCartOpen ? 'Cart--open' : ''} ${props.doneLoading ? '' : 'hidden'}`}>
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
        {cartLoading}
      </ul>
      <footer className="Cart__footer">
        <div className="Cart-info clearfix">
          <div className="Cart-info__total Cart-info__small">Subtotal</div>
          <div className="Cart-info__pricing">
            <span className="pricing">$ {props.checkout.subtotalPrice}</span>
          </div>
        </div>
        <div className="Cart-info clearfix">
          <div className="Cart-info__total Cart-info__small">Taxes</div>
          <div className="Cart-info__pricing">
            <span className="pricing">$ {props.checkout.totalTax}</span>
          </div>
        </div>
        <div className="Cart-info clearfix">
          <div className="Cart-info__total Cart-info__small">Total</div>
          <div className="Cart-info__pricing">
            <span className="pricing">$ {props.checkout.totalPrice}</span>
          </div>
        </div>
        <button className="Cart__checkout button" onClick={openCheckout}>Checkout</button>
      </footer>
    </div>
  )
}

export default Cart;
