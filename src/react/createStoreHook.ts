import { useSyncExternalStore, useCallback, useRef } from 'react';
import { createStore, shallowEqual } from '../core/store';
import type { Store, StoreOptions } from '../core/store';

type SetStateAction<T> = Partial<T> | ((prev: T) => Partial<T>);

type StateCreator<T> = (
    set: (action: SetStateAction<T>) => void,
    get: () => T
) => T;

export function create<T extends object>(
    stateCreator: StateCreator<T>,
    options: StoreOptions<T> = {}
) {
    // eslint-disable-next-line prefer-const
    let store: Store<T>;

    const initialState = stateCreator(
        (action) => store.setState(action),
        () => store.getState()
    );

    store = createStore(initialState, options);

    function useHook(): T;
    function useHook<R>(selector: (state: T) => R): R;
    function useHook<R>(selector?: (state: T) => R): T | R {

        const prevResultRef = useRef<T | R | null>(null);

        const getSnapshot = useCallback((): T | R => {
            const state = store.getState();

            const result: T | R = selector
                ? selector(state)
                : state;

            if (prevResultRef.current !== null) {
                if (typeof result === 'object' && result !== null) {
                    if (shallowEqual(prevResultRef.current, result)) {
                        return prevResultRef.current;
                    }
                } else {
                    if (Object.is(prevResultRef.current, result)) {
                        return prevResultRef.current;
                    }
                }
            }

            prevResultRef.current = result;
            return result;

        }, [selector]);

        return useSyncExternalStore(
            store.subscribe,
            getSnapshot,
            getSnapshot
        );
    }

    useHook.getState = store.getState;
    useHook.setState = store.setState;
    useHook.subscribe = store.subscribe;
    useHook.destroy = store.destroy;

    return useHook;
}