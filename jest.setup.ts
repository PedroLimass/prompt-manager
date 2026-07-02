import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'node:util';

Object.defineProperty(globalThis, 'TextEncoder', {
  value: TextEncoder,
});

Object.defineProperty(globalThis, 'TextDecoder', {
  value: TextDecoder,
});

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));

expect.extend({});
