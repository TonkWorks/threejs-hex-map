

export const KEY_CODES = {
    LEFT_ARROW: 41,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40,
    SHIFT: 16,
    ESC: 27,
    Q: 81,
    E: 69,
    G: 71,
    A: 65,
    S: 83,
    Z: 90,
    X: 88,
}

export interface KeyActions {
    [keyCode: number]: KeyAction;
}

export interface KeyAction {
    down?: () => void; // function to call when key is pressed
    up?: () => void; // function to call when key is released
}

export function paramString(name: string, defaultValue: string): string {
    const queryMatch = document.location.href.match(new RegExp(name+"=([^&]+)"))
    if (queryMatch) {
        return (queryMatch[1])
    } else {
        return defaultValue
    }
}

export function paramInt(name: string, defaultValue: number): number {
    return parseInt(paramString(name, defaultValue+""))
}

export function paramFloat(name: string, defaultValue: number): number {
    return parseFloat(paramString(name, defaultValue+""))
}

export function varying<T>(...values: T[]): T {
    return values[Math.round(Math.random() * (values.length - 1))]
}