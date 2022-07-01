import React from 'react';
import { render } from '@testing-library/react';

import Brands from './brands';

describe('Brands', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Brands />);
    expect(baseElement).toBeTruthy();
  });
});
