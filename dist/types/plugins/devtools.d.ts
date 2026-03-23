import type { Store } from '../core/store';
export declare function connectDevTools<T extends object>(store: Store<T>, name?: string): () => void;
