import React, {
  useState,
  useEffect,
  useTransition,
  Suspense
} from "react";


function LineItemm(props){

  const lineItem = props.lineItem;

  const lineItemId = lineItem.id;

  const removeLineItemInCart = () => {
      props.removeLineItemInCart(lineItemId);
  };

  const decrementQuantity = () => {
      const updatedQuantity = lineItem.quantity - 1
      props.updateQuantityInCart(lineItemId, updatedQuantity);
  }

  const incrementQuantity = () => {

      const updatedQuantity = lineItem.quantity + 1
      props.updateQuantityInCart(lineItemId, updatedQuantity);
  }

  return (
    <li className="Line-item">
      <div className="Line-item__img">
        {lineItem.variant.image ? <img src={lineItem.variant.image.src} alt={`${lineItem.title} product shot`}/> : null}
      </div>
      <div className="Line-item__content">
        <div className="Line-item__content-row">
          <div className="Line-item__variant-title">
            {lineItem.variant.title}
          </div>
          <span className="Line-item__title">
            {lineItem.title}
          </span>
        </div>
        <div className="Line-item__content-row">
          <div className="Line-item__quantity-container">
            <button
              disabled={props.checkoutPending}
              className="Line-item__quantity-update"
              onClick={decrementQuantity}>
            -</button>
            <span className="Line-item__quantity">{lineItem.quantity}</span>
            <button
              disabled={props.checkoutPending}
              className="Line-item__quantity-update"
              onClick={incrementQuantity}>
            +</button>
          </div>
          <span className="Line-item__price">
            $ { (lineItem.quantity * lineItem.variant.price).toFixed(2) }
          </span>
          <button
            className="Line-item__remove"
            disabled={props.checkoutPending}
            onClick={removeLineItemInCart}>
            ×</button>
        </div>
      </div>
    </li>
  );
}

export default LineItemm;
