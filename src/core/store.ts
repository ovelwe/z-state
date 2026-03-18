type Listener = () => void;
export type SetStateAction<T> = Partial<T> | ((prev: T) => Partial<T>);
type Middleware<T> = (
    next: (action: SetStateAction<T>) => void,
    getState: () => T
) => (action: SetStateAction<T>) => void;

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

export function createStore<T extends object>(
    initialState: T,
    options: StoreOptions<T> = {}
): Store<T> {

    let state: T = initialState;

    const listeners = new Set<Listener>(); // Set чтобы отсеивать дубликаты и легче удалять

    function getState(): T {
        return state;
    }

    function notify(): void {
        listeners.forEach(listener => {
            try {
                listener();
            } catch (error) {
                console.error('Zmanager: ошибка в listener:', error);
            }
        });
    }

    function setState(action: SetStateAction<T>): void {
        const prevState = state;

        const newValues = typeof action === 'function'
            ? (action as (prev: T) => Partial<T>)(state)
            : action;

        const nextState = { ...state, ...newValues };

        if (shallowEqual(state, nextState)) {
            return;
        }

        state = nextState;

        if (options.onUpdate) {
            options.onUpdate(state, prevState);
        }

        notify();
    }

    function subscribe(listener: Listener): () => void {
        listeners.add(listener);

        return () => {
            listeners.delete(listener); // cleanup по заветам реакта
        };
    }

    function destroy(): void {
        listeners.clear();
        state = initialState;
    }

    let finalSetState = setState;

    if (options.middleware && options.middleware.length > 0) {
        finalSetState = options.middleware.reduceRight(
            (next, mw) => {
                const wrappedNext = (action: SetStateAction<T>) => next(action);
                const middlewareFn = mw(wrappedNext, getState);
                return (action: SetStateAction<T>) => middlewareFn(action);
            },
            setState
        );
    }

    return {
        getState,
        setState: finalSetState,
        subscribe,
        destroy,
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shallowEqual(objA: any, objB: any): boolean {
    if (Object.is(objA, objB)) return true;
    if (
        typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null
    ) {
        return false;
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
        if (!Object.prototype.hasOwnProperty.call(objB, key)) return false;
        if (!Object.is(objA[key], objB[key])) return false;
    }

    return true;
}

export { shallowEqual };