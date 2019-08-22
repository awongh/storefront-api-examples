import { createPortal } from "react-dom";
import React, { useState, useEffect } from 'react';

const CartPortal = (props) => {

  const [modalContainer] = useState(document.createElement('div'));

  useEffect(() => {
    // Find the root element in your DOM
    let modalRoot = document.getElementById(props.appendId);

    // Append modal container to root
    modalRoot.appendChild(modalContainer);
    return function cleanup() {
      // On cleanup remove the modal container
      modalRoot.removeChild(modalContainer);
    };
  }, []); // <- The empty array tells react to apply the effect on mount/unmount

  let quantity = props.quantity > 0 ? props.quantity : '';

  const cart = (<div>
      <h2>{quantity}</h2>
      <button onClick={()=> props.setCartOpen(!props.isCartOpen)}>HELLO</button>
    </div>);

  return createPortal(cart, modalContainer);
};

export default CartPortal;
