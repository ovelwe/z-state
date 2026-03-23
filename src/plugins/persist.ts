import type { Store, StoreOptions } from '../core/store';
import { createStore } from '../core/store';

export interface PersistOptions<T extends object, P = T> {
    key: string;
    storage?: Storage;
    serialize?: (state: P) => string;
    deserialize?: (str: string) => Partial<T>;
    partialize?: (state: T) => P;
}

function getDefaultStorage(): Storage | undefined {
    if (typeof window === 'undefined') {
        return undefined;
    }

    return window.localStorage;
}

export function createPersistStore<T extends object>(
    initialState: T,
    persistOptions: Omit<PersistOptions<T, T>, 'partialize'> & {
        partialize?: undefined;
    },
    storeOptions?: StoreOptions<T>
): Store<T>;

export function createPersistStore<T extends object, P>(
    initialState: T,
    persistOptions: PersistOptions<T, P>,
    storeOptions?: StoreOptions<T>
): Store<T>;

export function createPersistStore<T extends object, P = T>(
    initialState: T,
    persistOptions: PersistOptions<T, P>,
    storeOptions: StoreOptions<T> = {}
): Store<T> {
    const storage = persistOptions.storage ?? getDefaultStorage();

    const serialize =
        persistOptions.serialize ??
        (JSON.stringify as unknown as (state: P) => string);

    const deserialize =
        persistOptions.deserialize ??
        (JSON.parse as unknown as (str: string) => Partial<T>);

    const partialize =
        persistOptions.partialize ??
        (((state: T) => state as unknown as P) as (state: T) => P);

    let restoredState: T = initialState;

    if (storage) {
        try {
            const saved = storage.getItem(persistOptions.key);

            if (saved) {
                const parsed = deserialize(saved);
                restoredState = { ...initialState, ...parsed };
            }
        } catch (error) {
            console.warn(
                `[z-state persist] Failed to restore "${persistOptions.key}":`,
                error
            );
        }
    }

    return createStore(restoredState, {
        ...storeOptions,
        onUpdate: (newState, prevState) => {
            if (storage) {
                try {
                    const partialState = partialize(newState);
                    const serialized = serialize(partialState);
                    storage.setItem(persistOptions.key, serialized);
                } catch (error) {
                    console.warn(
                        `[z-state persist] Failed to save "${persistOptions.key}":`,
                        error
                    );
                }
            }

            storeOptions.onUpdate?.(newState, prevState);
        },
    });
}