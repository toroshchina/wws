import React from 'react';
import { render } from '@testing-library/react';

import Lines from './lines';

describe('Lines', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Lines />);
    expect(baseElement).toBeTruthy();
  });
});
