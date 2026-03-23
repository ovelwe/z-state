import type { Store, StoreOptions } from '../core/store';
export interface PersistOptions<T extends object, P = T> {
    key: string;
    storage?: Storage;
    serialize?: (state: P) => string;
    deserialize?: (str: string) => Partial<T>;
    partialize?: (state: T) => P;
}
export declare function createPersistStore<T extends object>(initialState: T, persistOptions: Omit<PersistOptions<T, T>, 'partialize'> & {
    partialize?: undefined;
}, storeOptions?: StoreOptions<T>): Store<T>;
export declare function createPersistStore<T extends object, P>(initialState: T, persistOptions: PersistOptions<T, P>, storeOptions?: StoreOptions<T>): Store<T>;
