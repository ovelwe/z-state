import type { Store } from '../core/store';

export function connectDevTools<T extends object>(
    store: Store<T>,
    name: string = 'LiteState Store'
): () => void {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const devToolsExtension = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
    if (!devToolsExtension) {
        console.warn('[LiteState DevTools] Redux DevTools не установлен');
        return () => {};
    }

    const devTools = devToolsExtension.connect({ name });

    devTools.init(store.getState());

    const unsubscribe = store.subscribe(() => {
        devTools.send('setState', store.getState());
    });

    const unsubscribeDevTools = devTools.subscribe((message: any) => {
        if (message.type === 'DISPATCH') {
            switch (message.payload.type) {
                case 'JUMP_TO_STATE':
                case 'JUMP_TO_ACTION':
                    { const state = JSON.parse(message.state);
                    store.setState(() => state);
                    break; }
            }
        }
    });

    return () => {
        unsubscribe();
        unsubscribeDevTools?.();
        devToolsExtension.disconnect();
    };
}