import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, { shallow, render, mount } from 'enzyme';
import App from './App';
import nock from 'nock';

import Client from 'shopify-buy';

const client = Client.buildClient({
  storefrontAccessToken: 'dd4d4dc146542ba7763305d71d1b3d38',
  domain: 'graphql.myshopify.com'
});

it('renders without crashing', () => {
  const wrapper = mount(<App client={client}/>);
  const welcome = <h1>foo and bar</h1>;
  expect(wrapper).toContainReact(welcome);
});
