import React, { useEffect, useState, useTransition, Suspense } from "react";
import promiseRetry from 'promise-retry';

const PRETRY_SETTINGS = {
    retries:10,
    factor:5,
    minTimeout:1000,
    maxTimeout:20000,
    randomize:false
};


function wrapPromise(promise, successCb) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    r => {
      if( typeof successCb === "function" ){
        result = successCb(r);
      }else{
        result = r;

      }
      status = "success";
    },
    e => {
      console.log(`wrap`,e);
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        console.log("???????????????????????????????????????? hey pendung")
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}

function wrapPromiseRetry(retryCallback, successCallback){
  return wrapPromise(promiseRetry(retryCallback, PRETRY_SETTINGS), successCallback)
}


  
function LineItemButton(props){
  const checkout = props.checkout;
const checkou = props.gg
  console.log( checkou )
  const lineItemId = props.line_item.id
  const line_item = props.line_item


  const [item,setItem] = useState(props.line_item);

  const updateQuantityInCart = (quantity) => {
    //setCartPending(true);
    const checkoutId = checkout.id
    const lineItemsToUpdate = [{id: lineItemId, quantity: parseInt(quantity, 10)}]
    console.log("THE SHIT!!!!!!!!!!!!!!!!!!!!!!!")

    const retryCallback = (retry, number)=>{
      console.log("*************** iupdate VARIANT INSIDE RETRIE");
      console.log(typeof checkout);
      console.log(checkout);

      return props.updateLineItems(checkoutId, lineItemsToUpdate).catch(retry)
    };

    //props.setCheckout(wrapPromiseRetry(retryCallback))

    
    const yy = wrapPromiseRetry(retryCallback,(result)=>{
      console.log("##$$#$#$#$#$#$#$#$$#$#$$#",result);
      const item = result.lineItems.find(item => item.id === lineItemId);
      console.log(item.quantity)
      setItem(item)
      props.setCheckout({read:()=>result})
      //return item;

    })
    
    //setItem( yy );
  }












  const decrementQuantity = () => {
    const updatedQuantity = line_item.quantity - 1
    let ress = checkou.read();





    console.log("......................");
    console.log("......................");
    console.log("......................");
    console.log("......................");

    console.log( ress)
    console.log( ress.id)
    console.log( ress.updateLineItems )
    console.log("......................");
    console.log("......................");
    console.log("......................");
    console.log("......................");

    const lineItemsToUpdate = [{id: lineItemId, quantity: parseInt(updatedQuantity, 10)}]
      ress.updateLineItems(ress.id, lineItemsToUpdate)

    //props.updateQuantityInCart(lineItemId, updatedQuantity);

  }

  const incrementQuantity = () => {
    const updatedQuantity = item.quantity + 1
    updateQuantityInCart(updatedQuantity);
  }

  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  console.log(item);
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  return(<div className="Line-item__content-row">
            <div className="Line-item__quantity-container">
              <button
              disabled={props.cartIsPending}
              className="Line-item__btn Line-item__quantity-update"
              onClick={decrementQuantity}>
                -
              </button>
              <span className="Line-item__quantity">{item.quantity}</span>
              <button
                disabled={props.cartIsPending}
                className="Line-item__btn Line-item__quantity-update"
                onClick={incrementQuantity}>
                +
              </button>
            </div>
            <span className="Line-item__price">
              $ { (item.quantity * item.variant.price).toFixed(2) }
            </span>
            <button disabled={props.cartIsPending} className="Line-item__btn Line-item__remove" onClick={()=> props.removeLineItemInCart(props.line_item.id)}>×</button>
          </div>);
}

function LineItem(props){

  
  console.log("PROPS FF", props.ff);
  return (
    <li className="Line-item">
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
        <Suspense fallback={<h1 className="fello">line titem fallbk</h1>}>
          <LineItemButton
            setCheckout={props.setCheckout}
            checkout={props.checkout}
            gg={props.ff}
            cartIsPending={props.cartIsPending}
            updateLineItems={props.updateLineItems}
            updateQuantityInCart={props.updateQuantityInCart}
            removeLineItemInCart={props.removeLineItemInCart}
            line_item={props.line_item}
          />
        </Suspense>
      </div>
    </li>
  );
}

export default LineItem;
