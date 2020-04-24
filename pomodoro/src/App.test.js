import React from 'react';
import { render } from '@testing-library/react';
import Timer from './App';

test('renders learn react link', () => {
  const { getByText } = render(<Timer />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
