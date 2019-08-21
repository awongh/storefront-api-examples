import App from './app';
import ShopifyErrorBoundary from './shopifyWithError';
import React from 'react';

function Shopify(props){
  console.log("WOW", props);

  return (
    <ShopifyErrorBoundary>
      <App client={props.client} />
    </ShopifyErrorBoundary>);
}

export default Shopify;
