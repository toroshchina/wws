import React from 'react';
import { render } from '@testing-library/react';

import Create from './create';

describe('Create', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Create />);
    expect(baseElement).toBeTruthy();
  });
});
