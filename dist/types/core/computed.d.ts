import type { Store } from './store';
export declare function computed<T extends object, R>(store: Store<T>, computeFn: (state: T) => R): () => R;
