import type { StoreOptions } from '../core/store';
type SetStateAction<T> = Partial<T> | ((prev: T) => Partial<T>);
type StateCreator<T> = (set: (action: SetStateAction<T>) => void, get: () => T) => T;
export declare function create<T extends object>(stateCreator: StateCreator<T>, options?: StoreOptions<T>): {
    (): T;
    <R>(selector: (state: T) => R): R;
    getState: () => T;
    setState: (action: import("../core/store").SetStateAction<T>) => void;
    subscribe: (listener: () => void) => () => void;
    destroy: () => void;
};
export {};
