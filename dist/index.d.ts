type Listener = () => void;
type SetStateAction$1<T> = Partial<T> | ((prev: T) => Partial<T>);
type Middleware<T> = (next: (action: SetStateAction$1<T>) => void, getState: () => T) => (action: SetStateAction$1<T>) => void;
interface Store<T> {
    getState: () => T;
    setState: (action: SetStateAction$1<T>) => void;
    subscribe: (listener: Listener) => () => void;
    destroy: () => void;
}
interface StoreOptions<T> {
    middleware?: Middleware<T>[];
    onUpdate?: (newState: T, prevState: T) => void;
}
declare function createStore<T extends object>(initialState: T, options?: StoreOptions<T>): Store<T>;
declare function shallowEqual(objA: any, objB: any): boolean;

declare function useStore<T extends object>(store: Store<T>): T;
declare function useStoreSelector<T extends object, R>(store: Store<T>, selector: (state: T) => R, equalityFn?: (a: R, b: R) => boolean): R;

type SetStateAction<T> = Partial<T> | ((prev: T) => Partial<T>);
type StateCreator<T> = (set: (action: SetStateAction<T>) => void, get: () => T) => T;
declare function create<T extends object>(stateCreator: StateCreator<T>, options?: StoreOptions<T>): {
    (): T;
    <R>(selector: (state: T) => R): R;
    getState: () => T;
    setState: (action: SetStateAction$1<T>) => void;
    subscribe: (listener: () => void) => () => void;
    destroy: () => void;
};

declare function loggerMiddleware<T>(): (next: (action: SetStateAction$1<T>) => void, getState: () => T) => (action: SetStateAction$1<T>) => void;

interface PersistOptions<T extends object, P = T> {
    key: string;
    storage?: Storage;
    serialize?: (state: P) => string;
    deserialize?: (str: string) => Partial<T>;
    partialize?: (state: T) => P;
}
declare function createPersistStore<T extends object>(initialState: T, persistOptions: Omit<PersistOptions<T, T>, 'partialize'> & {
    partialize?: undefined;
}, storeOptions?: StoreOptions<T>): Store<T>;
declare function createPersistStore<T extends object, P>(initialState: T, persistOptions: PersistOptions<T, P>, storeOptions?: StoreOptions<T>): Store<T>;

declare function connectDevTools<T extends object>(store: Store<T>, name?: string): () => void;

declare function computed<T extends object, R>(store: Store<T>, computeFn: (state: T) => R): () => R;

export { computed, connectDevTools, create, createPersistStore, createStore, loggerMiddleware, shallowEqual, useStore, useStoreSelector };
export type { Store, StoreOptions };
