import React from 'react';
import { render } from '@testing-library/react';

import Producers from './producers';

describe('Producers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Producers />);
    expect(baseElement).toBeTruthy();
  });
});
