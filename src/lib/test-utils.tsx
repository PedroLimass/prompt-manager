import {
  render as rtlRender,
  type RenderOptions,
} from '@testing-library/react';
import { ReactElement } from 'react';

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return rtlRender(ui, { ...options });
}

export {
  act,
  cleanup,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
export { customRender as render };
