import type { SetStateAction } from '../core/store';

export function loggerMiddleware<T>() {
    return (
        next: (action: SetStateAction<T>) => void,
        getState: () => T
    ) => {
        return (action: SetStateAction<T>) => {
            const prevState = getState();
            console.group('%c[LiteState] Action', 'color: #9E9E9E; font-weight: bold');
            console.log('%cprev state:', 'color: #9E9E9E', prevState);
            console.log('%caction:', 'color: #03A9F4', action);

            next(action);

            const nextState = getState();
            console.log('%cnext state:', 'color: #4CAF50', nextState);
            console.groupEnd();
        };
    };
}