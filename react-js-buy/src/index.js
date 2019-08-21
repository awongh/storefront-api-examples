import React from 'react';
import ReactDOM from 'react-dom';
import Shopify from './shopify';
import './app.css';
import Client from 'shopify-buy';

// wtf it doesnt let you import from parent dir anymore
//import '../../shared/app.css';
import './app.css';

const client = Client.buildClient({
  storefrontAccessToken: 'dd4d4dc146542ba7763305d71d1b3d38',
  domain: 'graphql.myshopify.com'
});

ReactDOM.render(
  <Shopify client={client}/>,
  document.getElementById('root')
);
