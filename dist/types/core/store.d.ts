type Listener = () => void;
export type SetStateAction<T> = Partial<T> | ((prev: T) => Partial<T>);
type Middleware<T> = (next: (action: SetStateAction<T>) => void, getState: () => T) => (action: SetStateAction<T>) => void;
export interface Store<T> {
    getState: () => T;
    setState: (action: SetStateAction<T>) => void;
    subscribe: (listener: Listener) => () => void;
    destroy: () => void;
}
export interface StoreOptions<T> {
    middleware?: Middleware<T>[];
    onUpdate?: (newState: T, prevState: T) => void;
}
export declare function createStore<T extends object>(initialState: T, options?: StoreOptions<T>): Store<T>;
declare function shallowEqual(objA: any, objB: any): boolean;
export { shallowEqual };
