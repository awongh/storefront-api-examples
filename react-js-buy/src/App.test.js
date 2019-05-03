import React from 'react';
import ReactDOM from 'react-dom';
import {shallow} from 'enzyme';
import App from './App';

import Client from 'shopify-buy';

jest.mock('shopify-buy');

Client.buildClient.mockImplementation(() => {
  return {};
});

/*
const client = Client.buildClient({
  storefrontAccessToken: 'dd4d4dc146542ba7763305d71d1b3d38',
  domain: 'graphql.myshopify.com'
});
*/

it('renders without crashing', () => {
  const client = Client.buildClient();
  const wrapper = shallow(<App client={client}/>);
  const welcome = <h1>foo and bar</h1>;
  expect(wrapper).toContainReact(welcome);
});
