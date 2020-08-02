import React, { useState } from 'react';

const CartOpenContext = React.createContext([{}, () => {}]);

const CartOpenProvider = (props) => {

  const [isCartOpen,setCartOpen] = useState(false);

  return (
    <CartOpenContext.Provider value={[isCartOpen, setCartOpen]}>
      {props.children}
    </CartOpenContext.Provider>
  );
}

export { CartOpenContext, CartOpenProvider };
