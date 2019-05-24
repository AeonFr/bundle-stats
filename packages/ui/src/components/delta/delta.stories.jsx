import React from 'react';
import { storiesOf } from '@storybook/react';

import { getWrapperDecorator } from '../../stories';
import { Delta } from '.';

const stories = storiesOf('Components/Delta', module);
stories.addDecorator(getWrapperDecorator());

stories.add('default', () => (
  <Delta
    value={20}
    displayValue="20kb"
  />
));

stories.add('biggerIsBetter - false', () => (
  <Delta
    value={20}
    displayValue="20kb"
    biggerIsBetter={false}
  />
));

stories.add('empty', () => (
  <Delta
    value={0}
    displayValue="0kb"
  />
));