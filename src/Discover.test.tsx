import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react-native';
import { Discover } from './Discover';

describe('Discover', () => {
  it('should add navigation button when on Categories', () => {
    const { getByText, debug } = render(<Discover />);
    debug();
    // const Button = getByText('+');
    // fireEvent.press(Button);
  });
});
