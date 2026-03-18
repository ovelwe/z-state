import type { Store, StoreOptions } from '../core/store';
import { createStore } from '../core/store';

interface PersistOptions {
    key: string;
    storage?: Storage;
    serialize?: (state: unknown) => string;
    deserialize?: (str: string) => unknown;
    partialize?: (state: unknown) => unknown;
}

export function createPersistStore<T extends object>(
    initialState: T,
    persistOptions: PersistOptions,
    storeOptions: StoreOptions<T> = {}
): Store<T> {
    const {
        key,
        storage = localStorage,
        serialize = JSON.stringify,
        deserialize = JSON.parse,
        partialize = (s: T) => s,
    } = persistOptions;

    let restoredState = initialState;
    try {
        const saved = storage.getItem(key);
        if (saved) {
            const parsed = deserialize(saved);
            restoredState = { ...initialState, ...parsed };
        }
    } catch (e) {
        console.warn(`[LiteState Persist] Не удалось восстановить "${key}":`, e);
    }

    const store = createStore(restoredState, {
        ...storeOptions,
        onUpdate: (newState, prevState) => {
            try {
                const toSave = partialize(newState);
                storage.setItem(key, serialize(toSave));
            } catch (e) {
                console.warn(`[LiteState Persist] Не удалось сохранить "${key}":`, e);
            }

            storeOptions.onUpdate?.(newState, prevState);
        },
    });

    return store;
}