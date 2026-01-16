import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localforage
vi.mock('localforage', () => {
    const store: Record<string, any> = {};
    return {
        default: {
            createInstance: () => ({
                getItem: vi.fn((key) => Promise.resolve(store[key])),
                setItem: vi.fn((key, value) => {
                    store[key] = value;
                    return Promise.resolve(value);
                }),
                removeItem: vi.fn((key) => {
                    delete store[key];
                    return Promise.resolve();
                }),
                iterate: vi.fn((callback) => {
                    Object.values(store).forEach(callback);
                    return Promise.resolve();
                }),
                clear: vi.fn(() => {
                    for (const key in store) delete store[key];
                    return Promise.resolve();
                })
            })
        }
    };
});
