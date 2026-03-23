import type { Store } from '../core/store';
export declare function useStore<T extends object>(store: Store<T>): T;
export declare function useStoreSelector<T extends object, R>(store: Store<T>, selector: (state: T) => R, equalityFn?: (a: R, b: R) => boolean): R;
