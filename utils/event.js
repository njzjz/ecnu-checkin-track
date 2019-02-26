var r = {};

exports.on = function(a, t, n) {
    var i = [ t, n ], o = r[a];
    Array.isArray(o) ? o.push(i) : r[a] = [ i ];
}, exports.remove = function(a, t) {
    var n = r[a];
    Array.isArray(n) && (r[a] = n.filter(function(r) {
        return r[0] != t;
    }));
}, exports.emit = function(a, t) {
    var n = r[a];
    Array.isArray(n) && n.map(function(r) {
        var a = r[0];
        r[1].call(a, t);
    });
};