// event-names.ts

export const EVENT_NAMES = [
    "onanimationcancel",
    "onanimationend",
    "onanimationiteration",
    "onanimationstart",
    "oncopy",
    "oncut",
    "onpaste",
    "oncompositionend",
    "oncompositionstart",
    "oncompositionupdate",
    "onblur",
    "onchange",
    "onfocus",
    "onfocusin",
    "onfocusout",
    "oninput",
    "oninvalid",
    "onreset",
    "onsubmit",
    "onformdata",
    "onauxclick",
    "onclick",
    "oncontextmenu",
    "ondblclick",
    "onmousedown",
    "onmouseenter",
    "onmouseleave",
    "onmousemove",
    "onmouseout",
    "onmouseover",
    "onmouseup",
    "onwheel",
    "ondrag",
    "ondragend",
    "ondragenter",
    "ondragleave",
    "ondragover",
    "ondragstart",
    "ondrop",
    "ongotpointercapture",
    "onlostpointercapture",
    "onpointercancel",
    "onpointerdown",
    "onpointerenter",
    "onpointerleave",
    "onpointermove",
    "onpointerout",
    "onpointerover",
    "onpointerup",
    "onkeydown",
    "onkeypress",
    "onkeyup",
    "onabort",
    "oncanplay",
    "oncanplaythrough",
    "ondurationchange",
    "onemptied",
    "onended",
    "onloadeddata",
    "onloadedmetadata",
    "onloadstart",
    "onpause",
    "onplay",
    "onplaying",
    "onprogress",
    "onratechange",
    "onseeked",
    "onseeking",
    "onstalled",
    "onsuspend",
    "ontimeupdate",
    "onvolumechange",
    "onwaiting",
    "oncancel",
    "onclose",
    "onerror",
    "onload",
    "onscroll",
    "onsecuritypolicyviolation",
    "onslotchange",
    "ontoggle",
    "ontouchcancel",
    "ontouchend",
    "ontouchmove",
    "ontouchstart",
    "ontransitioncancel",
    "ontransitionend",
    "ontransitionrun",
    "ontransitionstart",
    "onfullscreenchange",
    "onfullscreenerror",
    "onbeforeinput",
    "onbeforetoggle",
    "oncontextlost",
    "oncontextrestored",
    "oncuechange",
    "onresize",
    "onscrollend",
    "onselect",
    "onwebkittransitionend",
    "onselectionchange",
    "onselectstart",
    "onwebkitanimationend",
    "onwebkitanimationiteration",
    "onwebkitanimationstart",
    "onbeforematch",
    "onpointerrawupdate",
] as const;

type AllNames = `on${keyof HTMLElementEventMap}`;
type Current = (typeof EVENT_NAMES)[number];

type _ValidEach = Current extends AllNames ? true : never;

// Missing keys we didn't include:
type _Missing = Exclude<AllNames, Current>;

// Extra keys we included that aren't actually in HTMLElementEventMap:
type _Extra = Exclude<Current, AllNames>;

// Asserts the array is "all and only" the keys of HTMLElementEventMap.
// If either side isn't `never`, this becomes `never` and you'll get an error.
export type _AssertAllAndOnly = [_Missing] extends [never]
    ? [_Extra] extends [never]
        ? true
        : never
    : never;

const _test: _ValidEach & _AssertAllAndOnly = true;

const eventNames = new Set<string>(EVENT_NAMES);

export const isEventName = (name: string) => eventNames.has(name);
