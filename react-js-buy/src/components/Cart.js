import React, {
  useState,
  useEffect,
  useTransition,
  Suspense
} from "react";



import LineItem from './LineItem';

function LineItemList(props){
  return (
    <>
    {props.checkout.read().lineItems.map((line_item) => {
      return (

        <Suspense
          fallback={<h2>HAHAHAHAHAHAHAHAHA...</h2>}
        >
        <LineItem
          updateQuantityInCart={props.updateQuantityInCart}
          removeLineItemInCart={props.removeLineItemInCart}
          key={line_item.id.toString()}
          line_item={line_item}
        />

        </Suspense>
      );
    })}
    </>
  );
}



function Cart(props){

  const openCheckout = () => {
    window.open(props.checkout.webUrl);
  }

  //const checkout = props.checkout.read();

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
          fallback={<h2>Cart Itemsssssss...</h2>}
        >
          <LineItemList
              checkout={props.checkout}
              updateQuantityInCart={props.updateQuantityInCart}
          />
        </Suspense>
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
