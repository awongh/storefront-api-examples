import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import App from './App';

// this doesn't work right
// https://github.com/testing-library/react-testing-library/issues/281
import { act } from 'react-dom/test-utils';

import checkoutFixture from '../fixtures/checkout-create-new.js';
//import checkoutFixture from '../js-buy-sdk/fixtures/checkout-create-fixture.js';
import queryProductsFixture from '../js-buy-sdk/fixtures/query-products-fixture.js';
import shopInfoFixture from '../js-buy-sdk/fixtures/shop-info-fixture.js';


import Client from 'shopify-buy';

const client = Client.buildClient({
  storefrontAccessToken: 'dd4d4dc146542ba7763305d71d1b3d38',
  domain: 'graphql.myshopify.com'
});

beforeEach(() => {
  console.log("hello");
  fetch.resetMocks()
});

afterEach(() => {
  console.log("bye");
});

it('renders without crashing', () => {

  fetch.mockResponseOnce(JSON.stringify( checkoutFixture ), { status: 200, headers: { 'content-type': 'application/json' } });

  fetch.mockResponseOnce(JSON.stringify(queryProductsFixture), { status: 200, headers: { 'content-type': 'application/json' } });
  fetch.mockResponseOnce(JSON.stringify(shopInfoFixture), { status: 200, headers: { 'content-type': 'application/json' } });

  act(()=>{

    //const wrapper = shallow(<App client={client}/>);
    const wrapper = mount(<App client={client}/>);

    const welcome = <h1>foo and bar</h1>;
    expect(wrapper).toContainReact(welcome);
    expect(global.fetch).toHaveBeenCalledTimes(3);
  })

});
