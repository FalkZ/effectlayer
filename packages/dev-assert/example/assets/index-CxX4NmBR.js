(function () {
    const o = document.createElement("link").relList;
    if (o && o.supports && o.supports("modulepreload")) return;
    for (const e of document.querySelectorAll('link[rel="modulepreload"]'))
        c(e);
    new MutationObserver((e) => {
        for (const r of e)
            if (r.type === "childList")
                for (const s of r.addedNodes)
                    s.tagName === "LINK" && s.rel === "modulepreload" && c(s);
    }).observe(document, { childList: !0, subtree: !0 });
    function i(e) {
        const r = {};
        return (
            e.integrity && (r.integrity = e.integrity),
            e.referrerPolicy && (r.referrerPolicy = e.referrerPolicy),
            e.crossOrigin === "use-credentials"
                ? (r.credentials = "include")
                : e.crossOrigin === "anonymous"
                  ? (r.credentials = "omit")
                  : (r.credentials = "same-origin"),
            r
        );
    }
    function c(e) {
        if (e.ep) return;
        e.ep = !0;
        const r = i(e);
        fetch(e.href, r);
    }
})();
const n = (t) => {
    console.log("end");
};
try {
    n({ test: 1 });
} catch (t) {
    console.error(t);
}
try {
    n();
} catch (t) {
    console.error(t);
}
