import React from 'react';
import { render } from 'react-dom';

import AppWrapper from './components/AppWrapper';

const ref = new Firebase("https://smsproject.firebaseio.com");

render(
  <AppWrapper />,
  document.getElementById('app'),
);
