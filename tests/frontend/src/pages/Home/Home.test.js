import React from 'react';
import { render } from '@testing-library/react';
import Home from './Home';
import { Typography } from '@mui/material';

test('renders home page with correct text', () => {
  const { getByText } = render(<Home />);
  
  // Assert that the "Welcome to Jobs2Finesse" text is present with the correct typography variant
  const welcomeText = getByText('Welcome to Jobs2Finesse');
  expect(welcomeText).toBeInTheDocument();
  expect(welcomeText).toHaveClass('MuiTypography-h2'); // Check if variant is "h2"

  // Assert that the "Find Your Dream Job Today!" text is present with the correct typography variant
  const findJobText = getByText('Find Your Dream Job Today!');
  expect(findJobText).toBeInTheDocument();
  expect(findJobText).toHaveClass('MuiTypography-h4'); // Check if variant is "h4"
});

test('renders home page with correct styles', () => {
  const { getByText } = render(<Home />);

  // Assert that the "Welcome to Jobs2Finesse" text has the correct styles
  const welcomeText = getByText('Welcome to Jobs2Finesse');
  expect(welcomeText).toHaveStyle('margin-top: 10px');
  expect(welcomeText).toHaveStyle('font-weight: 700');
  expect(welcomeText).toHaveStyle('text-transform: uppercase');
  expect(welcomeText).toHaveStyle('text-align: center');

  // Assert that the "Find Your Dream Job Today!" text has the correct styles
  const findJobText = getByText('Find Your Dream Job Today!');
  expect(findJobText).toHaveStyle('margin-top: 2px');
  expect(findJobText).toHaveStyle('font-weight: 500');
  expect(findJobText).toHaveStyle('text-align: center');
});
