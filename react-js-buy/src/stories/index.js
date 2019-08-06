import React from 'react';

import checkoutFixture from './fixtures/checkout-create-new.js';
import shopInfoFixture from '../../js-buy-sdk/fixtures/shop-info-fixture.js';
import queryProductsFixture from './fixtures/query-products-fixture.js';
import checkoutLineItemsAdd from './fixtures/checkout-line-items-add-fixture.js';

import App from '../App';
import Client from 'shopify-buy';
import '../../../shared/app.css';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import fetchMock from 'fetch-mock';

const client = Client.buildClient({

  storefrontAccessToken: 'dd4d4dc146542ba7763305d71d1b3d38',
  domain: 'graphql.myshopify.com'
});


storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Whole App', module)
    .add('with internet', () => (
      <App client={client}/>
    ))
    .add('without internet', () => {

      fetchMock.config.overwriteRoutes = true;

      // mock code from:
      // https://medium.com/@rafaelrozon/mock-axios-storybook-72404b1d427b
      // https://medium.com/@edogc/visual-unit-testing-with-react-storybook-and-fetch-mock-4594d3a281e6
      // https://gist.github.com/thebuilder/81301f27371416b49c3e5a920d86a6b9
      fetchMock.post(
        '*',
        (url, opts) => {
          // this will be called each time the lib tries to make a post graph QL query. intercept it and give back a thing.

          var checkout = `checkoutCreate`;
          if( JSON.parse( opts.body ).query.includes(checkout) ){

            var result = checkoutFixture;
          }else if( JSON.parse( opts.body ).query.includes("query { shop { currencyCode,paymentSettings") ){
            var result = shopInfoFixture;
          }else if( JSON.parse( opts.body ).query.includes("fragment VariantFragment on ProductVariant") ){
            var result = queryProductsFixture;
          }

          //debugger;

          return result;
      }).catch(unmatchedUrl => {
        console.log("what");
        debugger;

        return false;
      })

      return <App client={client}/>
    }).add('slow -without internet', () => {

      var delay = 15000;

      fetchMock.post(
        '*',
        (url, opts) => {
          // this will be called each time the lib tries to make a post graph QL query. intercept it and give back a thing.

          var checkout = `checkoutCreate`;
          if( JSON.parse( opts.body ).query.includes(checkout) ){

            var result = checkoutFixture;
          }else if( JSON.parse( opts.body ).query.includes("query { shop { currencyCode,paymentSettings") ){
            var result = shopInfoFixture;
          }else if( JSON.parse( opts.body ).query.includes("fragment VariantFragment on ProductVariant") ){
            var result = queryProductsFixture;
          }

          //debugger;
          return new Promise( (resolve, reject) => {
            setTimeout(()=>{
              console.log("%%%%%%%%%"+Math.random()+" : "+delay);
              resolve( result );
            },delay)
            console.log( delay );
            delay  = delay +  4000
            console.log("$$$$$$$$$$$$$$$$$$$$$$"+Math.random()+" : "+delay);
          });
      }).catch(unmatchedUrl => {
        console.log("what");
        debugger;

        return false;
      })

      return <App client={client}/>

    }).add('404 internet', () => {
      var delay = 15000;

      fetchMock.post(
        '*',
        (url, opts) => {
          return {
            body: {foo:"bar"},
            status:404,
          };
      }).catch(unmatchedUrl => {
        console.log("what");
        debugger;

        return false;
      })

      return <App client={client}/>
    });
