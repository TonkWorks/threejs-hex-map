interface ToastifyOptions {
    text?: string;
    node?: HTMLElement;
    duration?: number;
    selector?: string | HTMLElement | ShadowRoot;
    callback?: () => void;
    destination?: string;
    newWindow?: boolean;
    close?: boolean;
    gravity?: "top" | "bottom";
    positionLeft?: boolean;
    position?: string;
    backgroundColor?: string;
    avatar?: string;
    className?: string;
    stopOnFocus?: boolean;
    onClick?: () => void;
    offset?: {
        x: number | string;
        y: number | string;
    };
    escapeMarkup?: boolean;
    ariaLive?: string;
    style?: Partial<CSSStyleDeclaration>;
}
interface ToastifyDefaults extends ToastifyOptions {
    oldestFirst: boolean;
}
interface ToastifyInstance {
    options: ToastifyOptions;
    toastElement: HTMLDivElement | null;
    toastify: string;
    constructor: typeof Toastify;
    init(options: ToastifyOptions): ToastifyInstance;
    buildToast(): HTMLDivElement;
    showToast(): ToastifyInstance;
    hideToast(): void;
    removeElement(toastElement: HTMLDivElement): void;
}
declare class Toastify {
    [x: string]: any;
    static readonly version: string;
    static defaults: ToastifyDefaults;
    static lib: ToastifyInstance;
    constructor(options?: ToastifyOptions);
    static reposition(): typeof Toastify;
}
declare global {
    interface Window {
        Toastify: typeof Toastify;
    }
}
export default Toastify;
