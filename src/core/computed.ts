import type { Store } from './store';

export function computed<T extends object, R>(
    store: Store<T>,
    computeFn: (state: T) => R
): () => R {
    let cachedResult: R;
    let cachedState: T;
    let isFirst = true;

    return () => {
        const currentState = store.getState();

        if (!isFirst && currentState === cachedState) {
            return cachedResult;
        }

        cachedState = currentState;
        cachedResult = computeFn(currentState);
        isFirst = false;

        return cachedResult;
    };
}