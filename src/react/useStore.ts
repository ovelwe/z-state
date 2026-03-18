import { useSyncExternalStore, useCallback, useRef } from 'react';
import type {Store} from '../core/store';

export function useStore<T extends object>(store: Store<T>): T {
    const state = useSyncExternalStore(
        store.subscribe,
        store.getState,
        store.getState
    );
    return state;
}

export function useStoreSelector<T extends object, R>(
    store: Store<T>,
    selector: (state: T) => R,
    equalityFn: (a: R, b: R) => boolean = Object.is
): R {
    const prevResultRef = useRef<R | null>(null);

    const getSnapshot = useCallback(() => {
        const nextResult = selector(store.getState());

        if (
            prevResultRef.current !== null &&
            equalityFn(prevResultRef.current, nextResult)
        ) {
            return prevResultRef.current;
        }

        prevResultRef.current = nextResult;
        return nextResult;
    }, [store, selector, equalityFn]);

    return useSyncExternalStore(
        store.subscribe,
        getSnapshot,
        getSnapshot
    );
}