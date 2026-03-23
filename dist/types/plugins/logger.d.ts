import type { SetStateAction } from '../core/store';
export declare function loggerMiddleware<T>(): (next: (action: SetStateAction<T>) => void, getState: () => T) => (action: SetStateAction<T>) => void;
