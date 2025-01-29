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

class Toastify {
    [x: string]: any;
    public static readonly version: string = "1.13.0";
    public static defaults: ToastifyDefaults = {
        oldestFirst: true,
        text: "Toastify is awesome!",
        node: undefined,
        duration: 20,
        selector: undefined,
        callback: function () {},
        destination: undefined,
        newWindow: false,
        close: false,
        gravity: "top",
        positionLeft: false,
        position: '',
        backgroundColor: '',
        avatar: "",
        className: "",
        stopOnFocus: true,
        onClick: function () {},
        offset: {x: 0, y: 0},
        escapeMarkup: true,
        ariaLive: 'polite',
        style: {background: ''}
    };

    public static lib: ToastifyInstance;

    constructor(options?: ToastifyOptions) {
        // Create a new instance using the lib.init method
        const instance = Object.create(Toastify.lib) as ToastifyInstance;
        return instance.init(options || {});
    }

    public static reposition(): typeof Toastify {
        const topLeftOffsetSize = {
            top: 10,
            bottom: 10,
        };
        const topRightOffsetSize = {
            top: 10,
            bottom: 10,
        };
        const offsetSize = {
            top: 10,
            bottom: 10,
        };

        const allToasts = document.getElementsByClassName("toastify");
        let classUsed: "top" | "bottom";

        for (let i = 0; i < allToasts.length; i++) {
            const toast = allToasts[i] as HTMLElement;
            
            if (containsClass(toast, "toastify-top")) {
                classUsed = "top";
            } else {
                classUsed = "bottom";
            }

            const height = toast.offsetHeight;
            const offset = 0;
            const width = window.innerWidth > 0 ? window.innerWidth : screen.width;

            if (width <= 360) {
                toast.style[classUsed] = offsetSize[classUsed] + "px";
                offsetSize[classUsed] += height + offset;
            } else {
                if (containsClass(toast, "toastify-left")) {
                    toast.style[classUsed] = topLeftOffsetSize[classUsed] + "px";
                    topLeftOffsetSize[classUsed] += height + offset;
                } else {
                    toast.style[classUsed] = topRightOffsetSize[classUsed] + "px";
                    topRightOffsetSize[classUsed] += height + offset;
                }
            }
        }

        return this;
    }
}

function getAxisOffsetAValue(axis: 'x' | 'y', options: ToastifyOptions): string {
    if(options.offset && options.offset[axis]) {
        if(isNaN(options.offset[axis] as number)) {
            return options.offset[axis] as string;
        } else {
            return options.offset[axis] + 'px';
        }
    }
    return '0px';
}

function containsClass(elem: Element, yourClass: string): boolean {
    if (!elem || typeof yourClass !== "string") {
        return false;
    } else if (
        elem.className &&
        elem.className
            .trim()
            .split(/\s+/gi)
            .indexOf(yourClass) > -1
    ) {
        return true;
    }
    return false;
}

// Implementation of the lib object
Toastify.lib = {
    toastify: Toastify.version,
    constructor: Toastify,

    init: function(this: ToastifyInstance, options: ToastifyOptions): ToastifyInstance {
        this.options = {};
        this.toastElement = null;

        this.options.text = options.text || Toastify.defaults.text;
        this.options.node = options.node || Toastify.defaults.node;
        this.options.duration = options.duration === 0 ? 0 : options.duration || Toastify.defaults.duration;
        this.options.selector = options.selector || Toastify.defaults.selector;
        this.options.callback = options.callback || Toastify.defaults.callback;
        this.options.destination = options.destination || Toastify.defaults.destination;
        this.options.newWindow = options.newWindow || Toastify.defaults.newWindow;
        this.options.close = options.close || Toastify.defaults.close;
        this.options.gravity = options.gravity === "bottom" ? "bottom" : "top";
        this.options.positionLeft = options.positionLeft || Toastify.defaults.positionLeft;
        this.options.position = options.position || Toastify.defaults.position;
        this.options.backgroundColor = options.backgroundColor || Toastify.defaults.backgroundColor;
        this.options.avatar = options.avatar || Toastify.defaults.avatar;
        this.options.className = options.className || Toastify.defaults.className;
        this.options.stopOnFocus = options.stopOnFocus === undefined ? Toastify.defaults.stopOnFocus : options.stopOnFocus;
        this.options.onClick = options.onClick || Toastify.defaults.onClick;
        this.options.offset = options.offset || Toastify.defaults.offset;
        this.options.escapeMarkup = options.escapeMarkup !== undefined ? options.escapeMarkup : Toastify.defaults.escapeMarkup;
        this.options.ariaLive = options.ariaLive || Toastify.defaults.ariaLive;
        this.options.style = options.style || {...Toastify.defaults.style};

        if(options.backgroundColor) {
            this.options.style = {
                ...this.options.style,
                background: options.backgroundColor
            };
        }

        return this;
    },

    buildToast: function(this: ToastifyInstance): HTMLDivElement {
        if (!this.options) {
            throw "Toastify is not initialized";
        }

        const divElement = document.createElement("div");
        divElement.className = "toastify on " + (this.options.className || "");

        if (this.options.position) {
            divElement.className += " toastify-" + this.options.position;
        } else {
            if (this.options.positionLeft === true) {
                divElement.className += " toastify-left";
                console.warn('Property `positionLeft` will be depreciated in further versions. Please use `position` instead.');
            } else {
                divElement.className += " toastify-right";
            }
        }

        divElement.className += " " + (this.options.gravity === "bottom" ? "toastify-bottom" : "toastify-top");

        if (this.options.backgroundColor) {
            console.warn('DEPRECATION NOTICE: "backgroundColor" is being deprecated. Please use the "style.background" property.');
        }

        for (const property in this.options.style) {
            divElement.style[property] = this.options.style[property] as string;
        }

        if (this.options.ariaLive) {
            divElement.setAttribute('aria-live', this.options.ariaLive);
        }

        if (this.options.node && this.options.node.nodeType === Node.ELEMENT_NODE) {
            divElement.appendChild(this.options.node);
        } else {
            if (this.options.escapeMarkup) {
                divElement.innerText = this.options.text || '';
            } else {
                divElement.innerHTML = this.options.text || '';
            }

            if (this.options.avatar) {
                const avatarElement = document.createElement("img");
                avatarElement.src = this.options.avatar;
                avatarElement.className = "toastify-avatar";

                divElement.insertAdjacentElement("afterbegin", avatarElement);

                // if (this.options.position === "left" || this.options.positionLeft === true) {
                //     divElement.appendChild(avatarElement);
                // } else {
                //     divElement.insertAdjacentElement("afterbegin", avatarElement);
                // }
            }
        }

        if (this.options.close === true) {
            const closeElement = document.createElement("button");
            closeElement.type = "button";
            closeElement.setAttribute("aria-label", "Close");
            closeElement.className = "toast-close";
            closeElement.innerHTML = "&#10006;";

            closeElement.addEventListener(
                "click",
                (event: Event) => {
                    event.stopPropagation();
                    this.removeElement(this.toastElement as HTMLDivElement);
                    window.clearTimeout((this.toastElement as any).timeOutValue);
                }
            );

            const width = window.innerWidth > 0 ? window.innerWidth : screen.width;

            divElement.appendChild(closeElement);
            // if ((this.options.position === "left" || this.options.positionLeft === true) && width > 360) {
            //     divElement.insertAdjacentElement("afterbegin", closeElement);
            // } else {
            //     divElement.appendChild(closeElement);
            // }
        }

        if (this.options.stopOnFocus && this.options.duration > 0) {
            divElement.addEventListener(
                "mouseover",
                () => {
                    window.clearTimeout((divElement as any).timeOutValue);
                }
            );

            divElement.addEventListener(
                "mouseleave",
                () => {
                    (divElement as any).timeOutValue = window.setTimeout(
                        () => {
                            this.removeElement(divElement);
                        },
                        this.options.duration
                    );
                }
            );
        }

        if (typeof this.options.destination !== "undefined") {
            divElement.addEventListener(
                "click",
                (event: Event) => {
                    event.stopPropagation();
                    if (this.options.newWindow === true) {
                        window.open(this.options.destination, "_blank");
                    } else {
                        window.location.href = this.options.destination as string;
                    }
                }
            );
        }

        if (typeof this.options.onClick === "function" && typeof this.options.destination === "undefined") {
            divElement.addEventListener(
                "click",
                (event: Event) => {
                    event.stopPropagation();
                    if (this.options.onClick) {
                        this.options.onClick();
                    }
                }
            );
        }

        if(typeof this.options.offset === "object") {
            const x = getAxisOffsetAValue("x", this.options);
            const y = getAxisOffsetAValue("y", this.options);

            const xOffset = this.options.position === "left" ? x : "-" + x;
            const yOffset = this.options.gravity === "top" ? y : "-" + y;

            divElement.style.transform = `translate(${xOffset},${yOffset})`;
        }

        return divElement;
    },

    showToast: function(this: ToastifyInstance): ToastifyInstance {
        this.toastElement = this.buildToast();

        let rootElement: HTMLElement | ShadowRoot;
        
        if (typeof this.options.selector === "string") {
            const element = document.getElementById(this.options.selector);
            if (!element) {
                throw "Root element is not defined";
            }
            rootElement = element;
        } else if (this.options.selector instanceof HTMLElement) {
            rootElement = this.options.selector;
        } else if (typeof window !== 'undefined' && 
                   typeof (window as any).ShadowRoot !== 'undefined' && 
                   this.options.selector instanceof (window as any).ShadowRoot) {
            rootElement = this.options.selector;
        } else {
            rootElement = document.body;
        }

        const elementToInsert = Toastify.defaults.oldestFirst ? rootElement.firstChild : rootElement.lastChild;
        rootElement.insertBefore(this.toastElement, elementToInsert);

        Toastify.reposition();

        if (this.options.duration > 0) {
            (this.toastElement as any).timeOutValue = window.setTimeout(
                () => {
                    this.removeElement(this.toastElement as HTMLDivElement);
                },
                this.options.duration
            );
        }

        return this;
    },

    hideToast: function(this: ToastifyInstance): void {
        if (this.toastElement && (this.toastElement as any).timeOutValue) {
            clearTimeout((this.toastElement as any).timeOutValue);
        }
        this.removeElement(this.toastElement as HTMLDivElement);
    },

    removeElement: function(this: ToastifyInstance, toastElement: HTMLDivElement): void {
        toastElement.className = toastElement.className.replace(" on", "");

        window.setTimeout(
            () => {
                if (this.options.node && this.options.node.parentNode) {
                    this.options.node.parentNode.removeChild(this.options.node);
                }

                if (toastElement.parentNode) {
                    toastElement.parentNode.removeChild(toastElement);
                }

                if (this.options.callback) {
                    this.options.callback();
                }
                Toastify.reposition();
            },
            400
        );
    }
} as ToastifyInstance;

// Setting up the prototype for the init object
Toastify.lib.init.prototype = Toastify.lib;

// Export for different module systems
declare global {
    interface Window {
        Toastify: typeof Toastify;
    }
}

// Handle different module systems
if (typeof window !== 'undefined') {
    window.Toastify = Toastify;
}

export default Toastify;