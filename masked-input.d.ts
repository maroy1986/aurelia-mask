import { Masker } from "./masker";
export declare class MaskedInput {
    element: Element;
    inputElement: HTMLInputElement;
    value: string | number;
    mask: string;
    inputId: string;
    inputClass: string;
    disabled: boolean;
    bindMasking: boolean;
    aspnetMasking: boolean;
    placeholder: string;
    editMode: string;
    findInput: (Element) => HTMLInputElement;
    change: Function;
    masker: Masker;
    preventBackspace: boolean;
    oldValue: string;
    oldValueUnmasked: string;
    oldCaretPosition: number;
    oldSelectionLength: number;
    caretPos: number;
    keyDownHandler: any;
    keyUpHandler: any;
    inputHandler: any;
    clickHandler: any;
    focusHandler: any;
    selectHandler: any;
    isAttached: boolean;
    constructor(element: Element);
    bind(): void;
    attached(): void;
    findInputElement(): void;
    detached(): void;
    readonly maxCaretPos: number;
    readonly minCaretPos: number;
    onSelect(e: any): void;
    onClick(e: any): void;
    readonly unmaskedUIValue: string;
    readonly unmaskedModelValue: string;
    isAddition(doterriblethings?: boolean): boolean;
    isSingleAddition(): boolean;
    isDeletion(): boolean;
    onInput(e: any): void;
    _setValue(newValue: string | number): void;
    numberToString(val: number | string): string;
    stringToNumber(val: number | string): number;
    onFocus(e: any): void;
    onKeyUp(e: any): void;
    updateUIValue(valUnmasked: any, caretBumpBack: any, caretPos: any, caretPosOld: any): void;
    getSelectionLength(): any;
    onKeyDown(e: KeyboardEvent): void;
    getCaretPosition(): any;
    isValidCaretPosition(pos: any): boolean;
    setCaretPosition(pos: any): number;
    isFocused(): boolean;
    isHidden(): boolean;
    maskChanged(): void;
    valueChanged(newv: any, oldv: any): void;
}
