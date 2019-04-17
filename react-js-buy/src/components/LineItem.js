import React, { useState, useEffect } from 'react';
import classnames from 'classnames';

function LineItem(props){

  const [hasLoaded,setLoaded] = useState(false);
  const [deleted,setDeleted] = useState(false);

  const removeLineItemInCart = (lineItemId)=>{
    setDeleted( true );
    props.removeLineItemInCart(lineItemId);
  }

  const decrementQuantity = (lineItemId) => {
    const updatedQuantity = props.line_item.quantity - 1
    if( updatedQuantity === 0 ){
      setDeleted( true );
    }
    props.updateQuantityInCart(lineItemId, updatedQuantity);
  }

  const incrementQuantity = (lineItemId) => {
    const updatedQuantity = props.line_item.quantity + 1
    props.updateQuantityInCart(lineItemId, updatedQuantity);
  }

  let displayDateTime = props.line_item.customAttributes.find( item => item.key === 'displayDateTime' ? true : false ).value;

  let displayPlace = props.line_item.customAttributes.find( item => item.key === 'displayPlace' ? true : false ).value;

  let giftCard = props.line_item.customAttributes.find( item => item.key === 'giftCard' ? true : false ).value;


  let lineItemClass = classnames({
      "Line-item":true,
      animated:true,
      fadeInDown: props.loaded,
      fadeOut: deleted,
      blank: !props.loaded
  });

  console.log("line item load: "+hasLoaded);

  return (
    <li className="line-item-cont">
      <div className={lineItemClass}>
        <div className="Line-item__img">
          {props.line_item.variant.image ? <img src={props.line_item.variant.image.src} alt={`${props.line_item.title} product shot`}/> : null}
        </div>
        <div className="Line-item__content">
          <div className="Line-item__content-row">
            <div className="Line-item__variant-title">
              {props.line_item.variant.title}
            </div>
            <span className="Line-item__title">
              {props.line_item.title}
            </span>
          </div>
          <div className="Line-item__content-row">
            <div className="Line-item__quantity-container">
              <button className="Line-item__quantity-update" onClick={() => decrementQuantity(props.line_item.id)}>-</button>
              <span className="Line-item__quantity">{props.line_item.quantity}</span>
              <button className="Line-item__quantity-update" onClick={() => incrementQuantity(props.line_item.id)}>+</button>
            </div>
            <span className="Line-item__price">
              $ { (props.line_item.quantity * props.line_item.variant.price).toFixed(2) }
            </span>
            <button className="Line-item__remove" onClick={()=> removeLineItemInCart(props.line_item.id)}>×</button>
          </div>

          <div className="Line-item__content-row">
            place: {displayPlace}
          </div>

          <div className="Line-item__content-row">
            date: {displayDateTime}
          </div>

          <div className="Line-item__content-row">
            gift card: {giftCard}
          </div>
        </div>
      </div>
    </li>
  );
}

export default LineItem;
