import React from 'react';
import { render } from '@testing-library/react';

import Manufacturers from './manufacturers';

describe('Manufacturers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Manufacturers />);
    expect(baseElement).toBeTruthy();
  });
});
