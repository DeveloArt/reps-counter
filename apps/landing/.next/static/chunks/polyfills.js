!(() => {
  const t =
    'undefined' !== typeof globalThis
      ? globalThis
      : 'undefined' !== typeof window
        ? window
        : 'undefined' !== typeof global
          ? global
          : 'undefined' !== typeof self
            ? self
            : {};
  function e(t) {
    const e = { exports: {} };
    return t(e, e.exports), e.exports;
  }
  let r;
  let n;
  let o = (t) => t && t.Math === Math && t;
  const i =
    o('object' === typeof globalThis && globalThis) ||
    o('object' === typeof window && window) ||
    o('object' === typeof self && self) ||
    o('object' === typeof t && t) ||
    o('object' === typeof t && t) ||
    (function () {
      return this;
    })() ||
    Function('return this')();
  const a = (t) => {
    try {
      return !!t();
    } catch (_t) {
      return !0;
    }
  };
  const u = !a(() => 7 !== Object.defineProperty({}, 1, { get: () => 7 })[1]);
  let s = !a(() => {
    const t = (() => {}).bind();
    return 'function' !== typeof t || Object.hasOwn(t, 'prototype');
  });
  const c = Function.prototype.call;
  const f = s ? c.bind(c) : () => c.apply(c, arguments);
  let l = {}.propertyIsEnumerable;
  const h = Object.getOwnPropertyDescriptor;
  const p =
    h && !l.call({ 1: 2 }, 1)
      ? function (t) {
          const e = h(this, t);
          return !!e && e.enumerable;
        }
      : l;
  const v = { f: p };
  const d = (t, e) => ({
    enumerable: !(1 & t),
    configurable: !(2 & t),
    writable: !(4 & t),
    value: e,
  });
  const g = Function.prototype;
  let y = g.call;
  const m = s && g.bind.bind(y, y);
  const b = s ? m : (t) => () => y.apply(t, arguments);
  const w = b({}.toString);
  const S = b(''.slice);
  const E = (t) => S(w(t), 8, -1);
  const O = Object;
  const x = b(''.split);
  const R = a(() => !O('z').propertyIsEnumerable(0))
    ? (t) => ('String' === E(t) ? x(t, '') : O(t))
    : O;
  const P = (t) => null == t;
  const A = TypeError;
  const j = (t) => {
    if (P(t)) throw new A(`Can't call method on ${t}`);
    return t;
  };
  const k = (t) => R(j(t));
  const I = 'object' === typeof document && document.all;
  const T =
    void 0 === I && void 0 !== I
      ? (t) => 'function' === typeof t || t === I
      : (t) => 'function' === typeof t;
  const M = (t) => ('object' === typeof t ? null !== t : T(t));
  const L = (t, e) => (arguments.length < 2 ? (T((r = i[t])) ? r : void 0) : i[t]?.[e]);
  const U = b({}.isPrototypeOf);
  const N = i.navigator;
  const C = N?.userAgent;
  const _ = C ? String(C) : '';
  const F = i.process;
  const B = i.Deno;
  const D = F?.versions || B?.version;
  const z = D?.v8;
  z && (n = (r = z.split('.'))[0] > 0 && r[0] < 4 ? 1 : +(r[0] + r[1])),
    !n &&
      _ &&
      (!(r = _.match(/Edge\/(\d+)/)) || r[1] >= 74) &&
      (r = _.match(/Chrome\/(\d+)/)) &&
      (n = +r[1]);
  const W = n;
  const q = i.String;
  const H =
    !!Object.getOwnPropertySymbols &&
    !a(() => {
      const t = Symbol('symbol detection');
      return !q(t) || !(Object(t) instanceof Symbol) || (!Symbol.sham && W && W < 41);
    });
  const $ = H && !Symbol.sham && 'symbol' === typeof Symbol.iterator;
  const K = Object;
  const G = $
    ? (t) => 'symbol' === typeof t
    : (t) => {
        const e = L('Symbol');
        return T(e) && U(e.prototype, K(t));
      };
  const V = String;
  const Y = (t) => {
    try {
      return V(t);
    } catch (_t) {
      return 'Object';
    }
  };
  const X = TypeError;
  const J = (t) => {
    if (T(t)) return t;
    throw new X(`${Y(t)} is not a function`);
  };
  const Q = (t, e) => {
    const r = t[e];
    return P(r) ? void 0 : J(r);
  };
  const Z = TypeError;
  const tt = Object.defineProperty;
  const et = (t, e) => {
    try {
      tt(i, t, { value: e, configurable: !0, writable: !0 });
    } catch (_r) {
      i[t] = e;
    }
    return e;
  };
  const rt = e((t) => {
    const e = '__core-js_shared__';
    const r = (t.exports = i[e] || et(e, {}));
    (r.versions || (r.versions = [])).push({
      version: '3.38.1',
      mode: 'global',
      copyright: '© 2014-2024 Denis Pushkarev (zloirock.ru)',
      license: 'https://github.com/zloirock/core-js/blob/v3.38.1/LICENSE',
      source: 'https://github.com/zloirock/core-js',
    });
  });
  const nt = (t, e) => rt[t] || (rt[t] = e || {});
  const ot = Object;
  const it = (t) => ot(j(t));
  const at = b({}.hasOwnProperty);
  const ut = Object.hasOwn || ((t, e) => at(it(t), e));
  let st = 0;
  const ct = Math.random();
  const ft = b((1).toString);
  const lt = (t) => `Symbol(${void 0 === t ? '' : t})_${ft(++st + ct, 36)}`;
  const ht = i.Symbol;
  const pt = nt('wks');
  const vt = $ ? ht.for || ht : ht?.withoutSetter || lt;
  const dt = (t) => (ut(pt, t) || (pt[t] = H && ut(ht, t) ? ht[t] : vt(`Symbol.${t}`)), pt[t]);
  const gt = TypeError;
  const yt = dt('toPrimitive');
  const mt = (t, e) => {
    if (!M(t) || G(t)) return t;
    let r;
    const n = Q(t, yt);
    if (n) {
      if ((void 0 === e && (e = 'default'), (r = f(n, t, e)), !M(r) || G(r))) return r;
      throw new gt("Can't convert object to primitive value");
    }
    return (
      void 0 === e && (e = 'number'),
      ((t, e) => {
        let r;
        let n;
        if ('string' === e && T((r = t.toString)) && !M((n = f(r, t)))) return n;
        if (T((r = t.valueOf)) && !M((n = f(r, t)))) return n;
        if ('string' !== e && T((r = t.toString)) && !M((n = f(r, t)))) return n;
        throw new Z("Can't convert object to primitive value");
      })(t, e)
    );
  };
  const bt = (t) => {
    const e = mt(t, 'string');
    return G(e) ? e : `${e}`;
  };
  const wt = i.document;
  const St = M(wt) && M(wt.createElement);
  const Et = (t) => (St ? wt.createElement(t) : {});
  const Ot = !u && !a(() => 7 !== Object.defineProperty(Et('div'), 'a', { get: () => 7 }).a);
  const xt = Object.getOwnPropertyDescriptor;
  const Rt = {
    f: u
      ? xt
      : (t, e) => {
          if (((t = k(t)), (e = bt(e)), Ot))
            try {
              return xt(t, e);
            } catch (_t) {}
          if (ut(t, e)) return d(!f(v.f, t, e), t[e]);
        },
  };
  const Pt =
    u &&
    a(
      () =>
        42 !== Object.defineProperty(() => {}, 'prototype', { value: 42, writable: !1 }).prototype
    );
  const At = String;
  const jt = TypeError;
  const kt = (t) => {
    if (M(t)) return t;
    throw new jt(`${At(t)} is not an object`);
  };
  const It = TypeError;
  const Tt = Object.defineProperty;
  const Mt = Object.getOwnPropertyDescriptor;
  const Lt = 'enumerable';
  const Ut = 'configurable';
  const Nt = 'writable';
  const Ct = {
    f: u
      ? Pt
        ? (t, e, r) => {
            if (
              (kt(t),
              (e = bt(e)),
              kt(r),
              'function' === typeof t && 'prototype' === e && 'value' in r && Nt in r && !r[Nt])
            ) {
              const n = Mt(t, e);
              n?.[Nt] &&
                ((t[e] = r.value),
                (r = {
                  configurable: Ut in r ? r[Ut] : n[Ut],
                  enumerable: Lt in r ? r[Lt] : n[Lt],
                  writable: !1,
                }));
            }
            return Tt(t, e, r);
          }
        : Tt
      : (t, e, r) => {
          if ((kt(t), (e = bt(e)), kt(r), Ot))
            try {
              return Tt(t, e, r);
            } catch (_t) {}
          if ('get' in r || 'set' in r) throw new It('Accessors not supported');
          return 'value' in r && (t[e] = r.value), t;
        },
  };
  const _t = u ? (t, e, r) => Ct.f(t, e, d(1, r)) : (t, e, r) => ((t[e] = r), t);
  const Ft = Function.prototype;
  const Bt = u && Object.getOwnPropertyDescriptor;
  const Dt = ut(Ft, 'name');
  const zt = {
    EXISTS: Dt,
    PROPER: Dt && 'something' === (() => {}).name,
    CONFIGURABLE: Dt && (!u || (u && Bt(Ft, 'name').configurable)),
  };
  const Wt = b(Function.toString);
  T(rt.inspectSource) || (rt.inspectSource = (t) => Wt(t));
  let qt;
  let Ht;
  let $t;
  const Kt = rt.inspectSource;
  const Gt = i.WeakMap;
  const Vt = T(Gt) && /native code/.test(String(Gt));
  const Yt = nt('keys');
  const Xt = (t) => Yt[t] || (Yt[t] = lt(t));
  const Jt = {};
  const Qt = 'Object already initialized';
  const Zt = i.TypeError;
  if (Vt || rt.state) {
    const te = rt.state || (rt.state = new (0, i.WeakMap)());
    (te.get = te.get),
      (te.has = te.has),
      (te.set = te.set),
      (qt = (t, e) => {
        if (te.has(t)) throw new Zt(Qt);
        return (e.facade = t), te.set(t, e), e;
      }),
      (Ht = (t) => te.get(t) || {}),
      ($t = (t) => te.has(t));
  } else {
    const ee = Xt('state');
    (Jt[ee] = !0),
      (qt = (t, e) => {
        if (ut(t, ee)) throw new Zt(Qt);
        return (e.facade = t), _t(t, ee, e), e;
      }),
      (Ht = (t) => (ut(t, ee) ? t[ee] : {})),
      ($t = (t) => ut(t, ee));
  }
  let re;
  const ne = {
    set: qt,
    get: Ht,
    has: $t,
    enforce: (t) => ($t(t) ? Ht(t) : qt(t, {})),
    getterFor: (t) => (e) => {
      let r;
      if (!M(e) || (r = Ht(e)).type !== t) throw new Zt(`Incompatible receiver, ${t} required`);
      return r;
    },
  };
  const oe = e((t) => {
    const e = zt.CONFIGURABLE;
    const r = ne.enforce;
    const n = ne.get;
    const o = String;
    const i = Object.defineProperty;
    const s = b(''.slice);
    const c = b(''.replace);
    const f = b([].join);
    const l = u && !a(() => 8 !== i(() => {}, 'length', { value: 8 }).length);
    const h = String(String).split('String');
    const p = (t.exports = (t, n, a) => {
      'Symbol(' === s(o(n), 0, 7) && (n = `[${c(o(n), /^Symbol\(([^)]*)\).*$/, '$1')}]`),
        a?.getter && (n = `get ${n}`),
        a?.setter && (n = `set ${n}`),
        (!ut(t, 'name') || (e && t.name !== n)) &&
          (u ? i(t, 'name', { value: n, configurable: !0 }) : (t.name = n)),
        l && a && ut(a, 'arity') && t.length !== a.arity && i(t, 'length', { value: a.arity });
      try {
        a && ut(a, 'constructor') && a.constructor
          ? u && i(t, 'prototype', { writable: !1 })
          : t.prototype && (t.prototype = void 0);
      } catch (_t) {}
      const p = r(t);
      return ut(p, 'source') || (p.source = f(h, 'string' === typeof n ? n : '')), t;
    });
    Function.prototype.toString = p(function () {
      return (T(this) && n(this).source) || Kt(this);
    }, 'toString');
  });
  const ie = (t, e, r, n) => {
    n || (n = {});
    let o = n.enumerable;
    const i = void 0 !== n.name ? n.name : e;
    if ((T(r) && oe(r, i, n), n.global)) o ? (t[e] = r) : et(e, r);
    else {
      try {
        n.unsafe ? t[e] && (o = !0) : delete t[e];
      } catch (_t) {}
      o
        ? (t[e] = r)
        : Ct.f(t, e, {
            value: r,
            enumerable: !1,
            configurable: !n.nonConfigurable,
            writable: !n.nonWritable,
          });
    }
    return t;
  };
  const ae = Math.ceil;
  const ue = Math.floor;
  const se =
    Math.trunc ||
    ((t) => {
      const e = +t;
      return (e > 0 ? ue : ae)(e);
    });
  const ce = (t) => {
    const e = +t;
    return e !== e || 0 === e ? 0 : se(e);
  };
  const fe = Math.max;
  const le = Math.min;
  const he = (t, e) => {
    const r = ce(t);
    return r < 0 ? fe(r + e, 0) : le(r, e);
  };
  const pe = Math.min;
  const ve = (t) => {
    const e = ce(t);
    return e > 0 ? pe(e, 9007199254740991) : 0;
  };
  const de = (t) => ve(t.length);
  const ge = (t) => (e, r, n) => {
    const o = k(e);
    const i = de(o);
    if (0 === i) return !t && -1;
    let a;
    let u = he(n, i);
    if (t && r !== r) {
      while (i > u) if ((a = o[u++]) !== a) return !0;
    } else for (; i > u; u++) if ((t || u in o) && o[u] === r) return t || u || 0;
    return !t && -1;
  };
  const ye = { includes: ge(!0), indexOf: ge(!1) };
  const me = ye.indexOf;
  const be = b([].push);
  const we = (t, e) => {
    let r;
    const n = k(t);
    let o = 0;
    const i = [];
    for (r in n) !ut(Jt, r) && ut(n, r) && be(i, r);
    while (e.length > o) ut(n, (r = e[o++])) && (~me(i, r) || be(i, r));
    return i;
  };
  const Se = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf',
  ];
  const Ee = Se.concat('length', 'prototype');
  const Oe = { f: Object.getOwnPropertyNames || ((t) => we(t, Ee)) };
  const xe = { f: Object.getOwnPropertySymbols };
  const Re = b([].concat);
  const Pe =
    L('Reflect', 'ownKeys') ||
    ((t) => {
      const e = Oe.f(kt(t));
      const r = xe.f;
      return r ? Re(e, r(t)) : e;
    });
  const Ae = (t, e, r) => {
    for (let n = Pe(e), o = Ct.f, i = Rt.f, a = 0; a < n.length; a++) {
      const u = n[a];
      ut(t, u) || (r && ut(r, u)) || o(t, u, i(e, u));
    }
  };
  const je = /#|\.prototype\./;
  const ke = (t, e) => {
    const r = Te[Ie(t)];
    return r === Le || (r !== Me && (T(e) ? a(e) : !!e));
  };
  const Ie = (ke.normalize = (t) => String(t).replace(je, '.').toLowerCase());
  const Te = (ke.data = {});
  const Me = (ke.NATIVE = 'N');
  const Le = (ke.POLYFILL = 'P');
  const Ue = ke;
  const Ne = Rt.f;
  const Ce = (t, e) => {
    let r;
    let n;
    let o;
    let a;
    let u;
    const s = t.target;
    const c = t.global;
    const f = t.stat;
    if ((r = c ? i : f ? i[s] || et(s, {}) : i[s]?.prototype))
      for (n in e) {
        if (
          ((a = e[n]),
          (o = t.dontCallGetSet ? (u = Ne(r, n)) && u.value : r[n]),
          !Ue(c ? n : s + (f ? '.' : '#') + n, t.forced) && void 0 !== o)
        ) {
          if (typeof a === typeof o) continue;
          Ae(a, o);
        }
        (t.sham || o?.sham) && _t(a, 'sham', !0), ie(r, n, a, t);
      }
  };
  const _e = Object.keys || ((t) => we(t, Se));
  const Fe =
    u && !Pt
      ? Object.defineProperties
      : (t, e) => {
          kt(t);
          for (let r, n = k(e), o = _e(e), i = o.length, a = 0; i > a; )
            Ct.f(t, (r = o[a++]), n[r]);
          return t;
        };
  const Be = { f: Fe };
  const De = L('document', 'documentElement');
  const ze = 'prototype';
  const We = 'script';
  const qe = Xt('IE_PROTO');
  const He = () => {};
  const $e = (t) => `<${We}>${t}</${We}>`;
  const Ke = (t) => {
    t.write($e('')), t.close();
    const e = t.parentWindow.Object;
    return (t = null), e;
  };
  let Ge = () => {
    try {
      re = new ActiveXObject('htmlfile');
    } catch (_t) {}
    let t;
    let e;
    let r;
    Ge =
      'undefined' !== typeof document
        ? document.domain && re
          ? Ke(re)
          : ((e = Et('iframe')),
            (r = `java${We}:`),
            (e.style.display = 'none'),
            De.appendChild(e),
            (e.src = String(r)),
            (t = e.contentWindow.document).open(),
            t.write($e('document.F=Object')),
            t.close(),
            t.F)
        : Ke(re);
    for (let n = Se.length; n--; ) delete Ge[ze][Se[n]];
    return Ge();
  };
  Jt[qe] = !0;
  const Ve =
    Object.create ||
    ((t, e) => {
      let r;
      return (
        null !== t ? ((He[ze] = kt(t)), (r = new He()), (He[ze] = null), (r[qe] = t)) : (r = Ge()),
        void 0 === e ? r : Be.f(r, e)
      );
    });
  const Ye = Ct.f;
  const Xe = dt('unscopables');
  const Je = Array.prototype;
  void 0 === Je[Xe] && Ye(Je, Xe, { configurable: !0, value: Ve(null) });
  const Qe = (t) => {
    Je[Xe][t] = !0;
  };
  Ce(
    { target: 'Array', proto: !0 },
    {
      at: function (t) {
        const e = it(this);
        const r = de(e);
        const n = ce(t);
        const o = n >= 0 ? n : r + n;
        return o < 0 || o >= r ? void 0 : e[o];
      },
    }
  ),
    Qe('at');
  const Ze = (t, e) => b(i[t].prototype[e]);
  const tr = (Ze('Array', 'at'), TypeError);
  const er = (t, e) => {
    if (!delete t[e]) throw new tr(`Cannot delete property ${Y(e)} of ${Y(t)}`);
  };
  const rr = Math.min;
  const nr =
    [].copyWithin ||
    function (t, e) {
      const r = it(this);
      const n = de(r);
      let o = he(t, n);
      let i = he(e, n);
      const a = arguments.length > 2 ? arguments[2] : void 0;
      let u = rr((void 0 === a ? n : he(a, n)) - i, n - o);
      let s = 1;
      for (i < o && o < i + u && ((s = -1), (i += u - 1), (o += u - 1)); u-- > 0; )
        i in r ? (r[o] = r[i]) : er(r, o), (o += s), (i += s);
      return r;
    };
  Ce({ target: 'Array', proto: !0 }, { copyWithin: nr }),
    Qe('copyWithin'),
    Ze('Array', 'copyWithin'),
    Ce(
      { target: 'Array', proto: !0 },
      {
        fill: function (t) {
          for (
            let e = it(this),
              r = de(e),
              n = arguments.length,
              o = he(n > 1 ? arguments[1] : void 0, r),
              i = n > 2 ? arguments[2] : void 0,
              a = void 0 === i ? r : he(i, r);
            a > o;
          )
            e[o++] = t;
          return e;
        },
      }
    ),
    Qe('fill'),
    Ze('Array', 'fill');
  const or = (t) => {
    if ('Function' === E(t)) return b(t);
  };
  const ir = or(or.bind);
  const ar = (t, e) => (J(t), void 0 === e ? t : s ? ir(t, e) : () => t.apply(e, arguments));
  const ur = Array.isArray || ((t) => 'Array' === E(t));
  const sr = {};
  sr[dt('toStringTag')] = 'z';
  const cr = '[object z]' === String(sr);
  const fr = dt('toStringTag');
  const lr = Object;
  const hr = 'Arguments' === E((() => arguments)());
  const pr = cr
    ? E
    : (t) => {
        let e;
        let r;
        let n;
        return void 0 === t
          ? 'Undefined'
          : null === t
            ? 'Null'
            : 'string' ===
                typeof (r = ((t, e) => {
                  try {
                    return t[e];
                  } catch (_t) {}
                })((e = lr(t)), fr))
              ? r
              : hr
                ? E(e)
                : 'Object' === (n = E(e)) && T(e.callee)
                  ? 'Arguments'
                  : n;
      };
  const vr = () => {};
  const dr = L('Reflect', 'construct');
  const gr = /^\s*(?:class|function)\b/;
  const yr = b(gr.exec);
  const mr = !gr.test(vr);
  const br = (t) => {
    if (!T(t)) return !1;
    try {
      return dr(vr, [], t), !0;
    } catch (_t) {
      return !1;
    }
  };
  const wr = (t) => {
    if (!T(t)) return !1;
    switch (pr(t)) {
      case 'AsyncFunction':
      case 'GeneratorFunction':
      case 'AsyncGeneratorFunction':
        return !1;
    }
    try {
      return mr || !!yr(gr, Kt(t));
    } catch (_t) {
      return !0;
    }
  };
  wr.sham = !0;
  const Sr =
    !dr ||
    a(() => {
      let t;
      return (
        br(br.call) ||
        !br(Object) ||
        !br(() => {
          t = !0;
        }) ||
        t
      );
    })
      ? wr
      : br;
  const Er = dt('species');
  const Or = Array;
  const xr = (t, e) =>
    new (((t) => {
      let e;
      return (
        ur(t) &&
          ((Sr((e = t.constructor)) && (e === Or || ur(e.prototype))) ||
            (M(e) && null === (e = e[Er]))) &&
          (e = void 0),
        void 0 === e ? Or : e
      );
    })(t))(0 === e ? 0 : e);
  const Rr = b([].push);
  const Pr = (t) => {
    const e = 1 === t;
    const r = 2 === t;
    const n = 3 === t;
    const o = 4 === t;
    const i = 6 === t;
    const a = 7 === t;
    const u = 5 === t || i;
    return (s, c, f, l) => {
      for (
        let h,
          p,
          v = it(s),
          d = R(v),
          g = de(d),
          y = ar(c, f),
          m = 0,
          b = l || xr,
          w = e ? b(s, g) : r || a ? b(s, 0) : void 0;
        g > m;
        m++
      )
        if ((u || m in d) && ((p = y((h = d[m]), m, v)), t))
          if (e) w[m] = p;
          else if (p)
            switch (t) {
              case 3:
                return !0;
              case 5:
                return h;
              case 6:
                return m;
              case 2:
                Rr(w, h);
            }
          else
            switch (t) {
              case 4:
                return !1;
              case 7:
                Rr(w, h);
            }
      return i ? -1 : n || o ? o : w;
    };
  };
  const Ar = {
    forEach: Pr(0),
    map: Pr(1),
    filter: Pr(2),
    some: Pr(3),
    every: Pr(4),
    find: Pr(5),
    findIndex: Pr(6),
    filterReject: Pr(7),
  };
  const jr = Ar.find;
  const kr = 'find';
  let Ir = !0;
  kr in [] &&
    Array(1)[kr](() => {
      Ir = !1;
    }),
    Ce(
      { target: 'Array', proto: !0, forced: Ir },
      {
        find: function (t) {
          return jr(this, t, arguments.length > 1 ? arguments[1] : void 0);
        },
      }
    ),
    Qe(kr),
    Ze('Array', 'find');
  const Tr = Ar.findIndex;
  const Mr = 'findIndex';
  let Lr = !0;
  Mr in [] &&
    Array(1)[Mr](() => {
      Lr = !1;
    }),
    Ce(
      { target: 'Array', proto: !0, forced: Lr },
      {
        findIndex: function (t) {
          return Tr(this, t, arguments.length > 1 ? arguments[1] : void 0);
        },
      }
    ),
    Qe(Mr),
    Ze('Array', 'findIndex');
  const Ur = TypeError;
  const Nr = (t) => {
    if (t > 9007199254740991) throw Ur('Maximum allowed index exceeded');
    return t;
  };
  const Cr = (t, e, r, n, o, i, a, u) => {
    for (let s, c, f = o, l = 0, h = !!a && ar(a, u); l < n; )
      l in r &&
        ((s = h ? h(r[l], l, e) : r[l]),
        i > 0 && ur(s)
          ? ((c = de(s)), (f = Cr(t, e, s, c, f, i - 1) - 1))
          : (Nr(f + 1), (t[f] = s)),
        f++),
        l++;
    return f;
  };
  const _r = Cr;
  Ce(
    { target: 'Array', proto: !0 },
    {
      flatMap: function (t) {
        let e;
        const r = it(this);
        const n = de(r);
        return (
          J(t),
          ((e = xr(r, 0)).length = _r(
            e,
            r,
            r,
            n,
            0,
            1,
            t,
            arguments.length > 1 ? arguments[1] : void 0
          )),
          e
        );
      },
    }
  ),
    Qe('flatMap'),
    Ze('Array', 'flatMap'),
    Ce(
      { target: 'Array', proto: !0 },
      {
        flat: function () {
          const t = arguments.length ? arguments[0] : void 0;
          const e = it(this);
          const r = de(e);
          const n = xr(e, 0);
          return (n.length = _r(n, e, e, r, 0, void 0 === t ? 1 : ce(t))), n;
        },
      }
    ),
    Qe('flat'),
    Ze('Array', 'flat');
  let Fr;
  let Br;
  let Dr;
  const zr = String;
  const Wr = (t) => {
    if ('Symbol' === pr(t)) throw new TypeError('Cannot convert a Symbol value to a string');
    return zr(t);
  };
  const qr = b(''.charAt);
  const Hr = b(''.charCodeAt);
  const $r = b(''.slice);
  const Kr = (t) => (e, r) => {
    let n;
    let o;
    const i = Wr(j(e));
    const a = ce(r);
    const u = i.length;
    return a < 0 || a >= u
      ? t
        ? ''
        : void 0
      : (n = Hr(i, a)) < 55296 ||
          n > 56319 ||
          a + 1 === u ||
          (o = Hr(i, a + 1)) < 56320 ||
          o > 57343
        ? t
          ? qr(i, a)
          : n
        : t
          ? $r(i, a, a + 2)
          : o - 56320 + ((n - 55296) << 10) + 65536;
  };
  const Gr = { codeAt: Kr(!1), charAt: Kr(!0) };
  const Vr = !a(() => {
    function t() {}
    return (t.prototype.constructor = null), Object.getPrototypeOf(new t()) !== t.prototype;
  });
  const Yr = Xt('IE_PROTO');
  const Xr = Object;
  const Jr = Xr.prototype;
  const Qr = Vr
    ? Xr.getPrototypeOf
    : (t) => {
        const e = it(t);
        if (ut(e, Yr)) return e[Yr];
        const r = e.constructor;
        return T(r) && e instanceof r ? r.prototype : e instanceof Xr ? Jr : null;
      };
  const Zr = dt('iterator');
  let tn = !1;
  [].keys &&
    ('next' in (Dr = [].keys()) ? (Br = Qr(Qr(Dr))) !== Object.prototype && (Fr = Br) : (tn = !0));
  const en =
    !M(Fr) ||
    a(() => {
      const t = {};
      return Fr[Zr].call(t) !== t;
    });
  en && (Fr = {}),
    T(Fr[Zr]) ||
      ie(Fr, Zr, function () {
        return this;
      });
  const rn = { IteratorPrototype: Fr, BUGGY_SAFARI_ITERATORS: tn };
  const nn = Ct.f;
  const on = dt('toStringTag');
  const an = (t, e, r) => {
    t && !r && (t = t.prototype), t && !ut(t, on) && nn(t, on, { configurable: !0, value: e });
  };
  const un = {};
  const sn = rn.IteratorPrototype;
  const cn = function () {
    return this;
  };
  const fn = (t, e, r, n) => {
    const o = `${e} Iterator`;
    return (t.prototype = Ve(sn, { next: d(+!n, r) })), an(t, o, !1), (un[o] = cn), t;
  };
  const ln = (t, e, r) => {
    try {
      return b(J(Object.getOwnPropertyDescriptor(t, e)[r]));
    } catch (_t) {}
  };
  const hn = String;
  const pn = TypeError;
  const vn = (t) => {
    if (((t) => M(t) || null === t)(t)) return t;
    throw new pn(`Can't set ${hn(t)} as a prototype`);
  };
  const dn =
    Object.setPrototypeOf ||
    ('__proto__' in {}
      ? (() => {
          let t;
          let e = !1;
          const r = {};
          try {
            (t = ln(Object.prototype, '__proto__', 'set'))(r, []), (e = Array.isArray(r));
          } catch (_t) {}
          return (r, n) => (j(r), vn(n), M(r) ? (e ? t(r, n) : (r.__proto__ = n), r) : r);
        })()
      : void 0);
  const gn = zt.PROPER;
  const yn = zt.CONFIGURABLE;
  const mn = rn.IteratorPrototype;
  const bn = rn.BUGGY_SAFARI_ITERATORS;
  const wn = dt('iterator');
  const Sn = 'keys';
  const En = 'values';
  const On = 'entries';
  const xn = function () {
    return this;
  };
  const Rn = (t, e, r, n, o, i, a) => {
    fn(r, e, n);
    let u;
    let s;
    let c;
    const l = (t) => {
      if (t === o && g) return g;
      if (!bn && t && t in v) return v[t];
      switch (t) {
        case Sn:
        case En:
        case On:
          return function () {
            return new r(this, t);
          };
      }
      return function () {
        return new r(this);
      };
    };
    const h = `${e} Iterator`;
    let p = !1;
    const v = t.prototype;
    const d = v[wn] || v['@@iterator'] || (o && v[o]);
    let g = (!bn && d) || l(o);
    const y = ('Array' === e && v.entries) || d;
    if (
      (y &&
        (u = Qr(y.call(new t()))) !== Object.prototype &&
        u.next &&
        (Qr(u) !== mn && (dn ? dn(u, mn) : T(u[wn]) || ie(u, wn, xn)), an(u, h, !0)),
      gn &&
        o === En &&
        d &&
        d.name !== En &&
        (yn
          ? _t(v, 'name', En)
          : ((p = !0),
            (g = function () {
              return f(d, this);
            }))),
      o)
    )
      if (((s = { values: l(En), keys: i ? g : l(Sn), entries: l(On) }), a))
        for (c in s) (bn || p || !(c in v)) && ie(v, c, s[c]);
      else Ce({ target: e, proto: !0, forced: bn || p }, s);
    return v[wn] !== g && ie(v, wn, g, { name: o }), (un[e] = g), s;
  };
  const Pn = (t, e) => ({ value: t, done: e });
  const An = Gr.charAt;
  const jn = 'String Iterator';
  const kn = ne.set;
  const In = ne.getterFor(jn);
  Rn(
    String,
    'String',
    function (t) {
      kn(this, { type: jn, string: Wr(t), index: 0 });
    },
    function () {
      let t;
      const e = In(this);
      const r = e.string;
      const n = e.index;
      return n >= r.length ? Pn(void 0, !0) : ((t = An(r, n)), (e.index += t.length), Pn(t, !1));
    }
  );
  const Tn = (t, e, r) => {
    let n;
    let o;
    kt(t);
    try {
      if (!(n = Q(t, 'return'))) {
        if ('throw' === e) throw r;
        return r;
      }
      n = f(n, t);
    } catch (t) {
      (o = !0), (n = t);
    }
    if ('throw' === e) throw r;
    if (o) throw n;
    return kt(n), r;
  };
  const Mn = (t, e, r, n) => {
    try {
      return n ? e(kt(r)[0], r[1]) : e(r);
    } catch (e) {
      Tn(t, 'throw', e);
    }
  };
  const Ln = dt('iterator');
  const Un = Array.prototype;
  const Nn = (t) => void 0 !== t && (un.Array === t || Un[Ln] === t);
  const Cn = (t, e, r) => {
    u ? Ct.f(t, e, d(0, r)) : (t[e] = r);
  };
  const _n = dt('iterator');
  const Fn = (t) => {
    if (!P(t)) return Q(t, _n) || Q(t, '@@iterator') || un[pr(t)];
  };
  const Bn = TypeError;
  const Dn = (t, e) => {
    const r = arguments.length < 2 ? Fn(t) : e;
    if (J(r)) return kt(f(r, t));
    throw new Bn(`${Y(t)} is not iterable`);
  };
  const zn = Array;
  const Wn = function (t) {
    const e = it(t);
    const r = Sr(this);
    const n = arguments.length;
    let o = n > 1 ? arguments[1] : void 0;
    const i = void 0 !== o;
    i && (o = ar(o, n > 2 ? arguments[2] : void 0));
    let a;
    let u;
    let s;
    let c;
    let l;
    let h;
    const p = Fn(e);
    let v = 0;
    if (!p || (this === zn && Nn(p)))
      for (a = de(e), u = r ? new this(a) : zn(a); a > v; v++)
        (h = i ? o(e[v], v) : e[v]), Cn(u, v, h);
    else
      for (u = r ? new this() : [], l = (c = Dn(e, p)).next; !(s = f(l, c)).done; v++)
        (h = i ? Mn(c, o, [s.value, v], !0) : s.value), Cn(u, v, h);
    return (u.length = v), u;
  };
  const qn = dt('iterator');
  let Hn = !1;
  try {
    let $n = 0;
    const Kn = {
      next: () => ({ done: !!$n++ }),
      return: () => {
        Hn = !0;
      },
    };
    (Kn[qn] = function () {
      return this;
    }),
      Array.from(Kn, () => {
        throw 2;
      });
  } catch (_t) {}
  const Gn = (t, e) => {
    try {
      if (!e && !Hn) return !1;
    } catch (_t) {
      return !1;
    }
    let r = !1;
    try {
      const n = {};
      (n[qn] = () => ({ next: () => ({ done: (r = !0) }) })), t(n);
    } catch (_t) {}
    return r;
  };
  const Vn = !Gn((t) => {
    Array.from(t);
  });
  Ce({ target: 'Array', stat: !0, forced: Vn }, { from: Wn });
  const Yn = i;
  const Xn = ye.includes;
  const Jn = a(() => !Array(1).includes());
  Ce(
    { target: 'Array', proto: !0, forced: Jn },
    {
      includes: function (t) {
        return Xn(this, t, arguments.length > 1 ? arguments[1] : void 0);
      },
    }
  ),
    Qe('includes'),
    Ze('Array', 'includes');
  const Qn = Ct.f;
  const Zn = 'Array Iterator';
  const to = ne.set;
  const eo = ne.getterFor(Zn);
  const ro = Rn(
    Array,
    'Array',
    function (t, e) {
      to(this, { type: Zn, target: k(t), index: 0, kind: e });
    },
    function () {
      const t = eo(this);
      const e = t.target;
      const r = t.index++;
      if (!e || r >= e.length) return (t.target = null), Pn(void 0, !0);
      switch (t.kind) {
        case 'keys':
          return Pn(r, !1);
        case 'values':
          return Pn(e[r], !1);
      }
      return Pn([r, e[r]], !1);
    },
    'values'
  );
  const no = (un.Arguments = un.Array);
  if ((Qe('keys'), Qe('values'), Qe('entries'), u && 'values' !== no.name))
    try {
      Qn(no, 'name', { value: 'values' });
    } catch (_t) {}
  cr ||
    ie(
      Object.prototype,
      'toString',
      cr
        ? {}.toString
        : function () {
            return `[object ${pr(this)}]`;
          },
      { unsafe: !0 }
    ),
    Ze('Array', 'values');
  const oo = Array;
  const io = a(() => {
    function t() {}
    return !(oo.of.call(t) instanceof t);
  });
  Ce(
    { target: 'Array', stat: !0, forced: io },
    {
      of: function () {
        for (let t = 0, e = arguments.length, r = new (Sr(this) ? this : oo)(e); e > t; )
          Cn(r, t, arguments[t++]);
        return (r.length = e), r;
      },
    }
  );
  const ao = dt('hasInstance');
  const uo = Function.prototype;
  ao in uo ||
    Ct.f(uo, ao, {
      value: oe(function (t) {
        if (!T(this) || !M(t)) return !1;
        const e = this.prototype;
        return M(e) ? U(e, t) : t instanceof this;
      }, ao),
    }),
    dt('hasInstance');
  const so = (t, e, r) => (
    r.get && oe(r.get, e, { getter: !0 }), r.set && oe(r.set, e, { setter: !0 }), Ct.f(t, e, r)
  );
  const co = zt.EXISTS;
  const fo = Function.prototype;
  const lo = b(fo.toString);
  const ho = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
  const po = b(ho.exec);
  u &&
    !co &&
    so(fo, 'name', {
      configurable: !0,
      get: function () {
        try {
          return po(ho, lo(this))[1];
        } catch (_t) {
          return '';
        }
      },
    });
  const vo = b([].slice);
  const go = Oe.f;
  const yo =
    'object' === typeof window && window && Object.getOwnPropertyNames
      ? Object.getOwnPropertyNames(window)
      : [];
  const mo = {
    f: (t) =>
      yo && 'Window' === E(t)
        ? ((t) => {
            try {
              return go(t);
            } catch (_t) {
              return vo(yo);
            }
          })(t)
        : go(k(t)),
  };
  const bo = a(() => {
    if ('function' === typeof ArrayBuffer) {
      const t = new ArrayBuffer(8);
      Object.isExtensible(t) && Object.defineProperty(t, 'a', { value: 8 });
    }
  });
  const wo = Object.isExtensible;
  const So =
    a(() => {
      wo(1);
    }) || bo
      ? (t) => !!M(t) && (!bo || 'ArrayBuffer' !== E(t)) && (!wo || wo(t))
      : wo;
  const Eo = !a(() => Object.isExtensible(Object.preventExtensions({})));
  const Oo = e((t) => {
    const e = Ct.f;
    let r = !1;
    const n = lt('meta');
    let o = 0;
    const i = (t) => {
      e(t, n, { value: { objectID: `O${o++}`, weakData: {} } });
    };
    const a = (t.exports = {
      enable: () => {
        (a.enable = () => {}), (r = !0);
        const t = Oe.f;
        const e = b([].splice);
        const o = {};
        (o[n] = 1),
          t(o).length &&
            ((Oe.f = (r) => {
              for (let o = t(r), i = 0, a = o.length; i < a; i++)
                if (o[i] === n) {
                  e(o, i, 1);
                  break;
                }
              return o;
            }),
            Ce({ target: 'Object', stat: !0, forced: !0 }, { getOwnPropertyNames: mo.f }));
      },
      fastKey: (t, e) => {
        if (!M(t)) return 'symbol' === typeof t ? t : ('string' === typeof t ? 'S' : 'P') + t;
        if (!ut(t, n)) {
          if (!So(t)) return 'F';
          if (!e) return 'E';
          i(t);
        }
        return t[n].objectID;
      },
      getWeakData: (t, e) => {
        if (!ut(t, n)) {
          if (!So(t)) return !0;
          if (!e) return !1;
          i(t);
        }
        return t[n].weakData;
      },
      onFreeze: (t) => (Eo && r && So(t) && !ut(t, n) && i(t), t),
    });
    Jt[n] = !0;
  });
  const xo = TypeError;
  const Ro = function (t, e) {
    (this.stopped = t), (this.result = e);
  };
  const Po = Ro.prototype;
  const Ao = (t, e, r) => {
    let n;
    let o;
    let i;
    let a;
    let u;
    let s;
    let c;
    const l = !(!r || !r.AS_ENTRIES);
    const h = !(!r || !r.IS_RECORD);
    const p = !(!r || !r.IS_ITERATOR);
    const v = !(!r || !r.INTERRUPTED);
    const d = ar(e, r?.that);
    const g = (t) => (n && Tn(n, 'normal', t), new Ro(!0, t));
    const y = (t) => (l ? (kt(t), v ? d(t[0], t[1], g) : d(t[0], t[1])) : v ? d(t, g) : d(t));
    if (h) n = t.iterator;
    else if (p) n = t;
    else {
      if (!(o = Fn(t))) throw new xo(`${Y(t)} is not iterable`);
      if (Nn(o)) {
        for (i = 0, a = de(t); a > i; i++) if ((u = y(t[i])) && U(Po, u)) return u;
        return new Ro(!1);
      }
      n = Dn(t, o);
    }
    for (s = h ? t.next : n.next; !(c = f(s, n)).done; ) {
      try {
        u = y(c.value);
      } catch (t) {
        Tn(n, 'throw', t);
      }
      if ('object' === typeof u && u && U(Po, u)) return u;
    }
    return new Ro(!1);
  };
  const jo = TypeError;
  const ko = (t, e) => {
    if (U(e, t)) return t;
    throw new jo('Incorrect invocation');
  };
  const Io = (t, e, r) => {
    let n;
    let o;
    return (
      dn &&
        T((n = e.constructor)) &&
        n !== r &&
        M((o = n.prototype)) &&
        o !== r.prototype &&
        dn(t, o),
      t
    );
  };
  const To = (t, e, r) => {
    const n = -1 !== t.indexOf('Map');
    const o = -1 !== t.indexOf('Weak');
    const u = n ? 'set' : 'add';
    const s = i[t];
    const c = s?.prototype;
    let f = s;
    const l = {};
    const h = (t) => {
      const e = b(c[t]);
      ie(
        c,
        t,
        'add' === t
          ? function (t) {
              return e(this, 0 === t ? 0 : t), this;
            }
          : 'delete' === t
            ? function (t) {
                return !(o && !M(t)) && e(this, 0 === t ? 0 : t);
              }
            : 'get' === t
              ? function (t) {
                  return o && !M(t) ? void 0 : e(this, 0 === t ? 0 : t);
                }
              : 'has' === t
                ? function (t) {
                    return !(o && !M(t)) && e(this, 0 === t ? 0 : t);
                  }
                : function (t, r) {
                    return e(this, 0 === t ? 0 : t, r), this;
                  }
      );
    };
    if (
      Ue(
        t,
        !T(s) ||
          !(
            o ||
            (c.forEach &&
              !a(() => {
                new s().entries().next();
              }))
          )
      )
    )
      (f = r.getConstructor(e, t, n, u)), Oo.enable();
    else if (Ue(t, !0)) {
      const p = new f();
      const v = p[u](o ? {} : -0, 1) !== p;
      const d = a(() => {
        p.has(1);
      });
      const g = Gn((t) => {
        new s(t);
      });
      const y =
        !o &&
        a(() => {
          for (let t = new s(), e = 5; e--; ) t[u](e, e);
          return !t.has(-0);
        });
      g ||
        (((f = e((t, e) => {
          ko(t, c);
          const r = Io(new s(), t, f);
          return P(e) || Ao(e, r[u], { that: r, AS_ENTRIES: n }), r;
        })).prototype = c),
        (c.constructor = f)),
        (d || y) && (h('delete'), h('has'), n && h('get')),
        (y || v) && h(u),
        (o&&c.clear&&c.clear = undefined);
    }
    return (
      (l[t] = f),
      Ce({ global: !0, constructor: !0, forced: f !== s }, l),
      an(f, t),
      o || r.setStrong(f, t, n),
      f
    );
  };
  const Mo = (t, e, r) => {
    for (const n in e) ie(t, n, e[n], r);
    return t;
  };
  const Lo = dt('species');
  const Uo = (t) => {
    const e = L(t);
    u &&
      e &&
      !e[Lo] &&
      so(e, Lo, {
        configurable: !0,
        get: function () {
          return this;
        },
      });
  };
  const No = Oo.fastKey;
  const Co = ne.set;
  const _o = ne.getterFor;
  const Fo = {
    getConstructor: (t, e, r, n) => {
      const o = t((t, o) => {
        ko(t, i),
          Co(t, { type: e, index: Ve(null), first: null, last: null, size: 0 }),
          u || (t.size = 0),
          P(o) || Ao(o, t[n], { that: t, AS_ENTRIES: r });
      });
      const i = o.prototype;
      const a = _o(e);
      const s = (t, e, r) => {
        let n;
        let o;
        const i = a(t);
        let s = c(t, e);
        return (
          s
            ? (s.value = r)
            : ((i.last = s =
                {
                  index: (o = No(e, !0)),
                  key: e,
                  value: r,
                  previous: (n = i.last),
                  next: null,
                  removed: !1,
                }),
              i.first || (i.first = s),
              n && (n.next = s),
              u ? i.size++ : t.size++,
              'F' !== o && (i.index[o] = s)),
          t
        );
      };
      const c = (t, e) => {
        let r;
        const n = a(t);
        const o = No(e);
        if ('F' !== o) return n.index[o];
        for (r = n.first; r; r = r.next) if (r.key === e) return r;
      };
      return (
        Mo(i, {
          clear: function () {
            for (let t = a(this), e = t.first; e; )
              (e.removed = !0), e.previous && (e.previous = e.previous.next = null), (e = e.next);
            (t.first = t.last = null), (t.index = Ve(null)), u ? (t.size = 0) : (this.size = 0);
          },
          delete: function (t) {
            const r = a(this);
            const n = c(this, t);
            if (n) {
              const o = n.next;
              const i = n.previous;
              delete r.index[n.index],
                (n.removed = !0),
                i && (i.next = o),
                o && (o.previous = i),
                r.first === n && (r.first = o),
                r.last === n && (r.last = i),
                u ? r.size-- : this.size--;
            }
            return !!n;
          },
          forEach: function (t) {
            for (
              let e, r = a(this), n = ar(t, arguments.length > 1 ? arguments[1] : void 0);
              (e = e ? e.next : r.first);
            )
              for (n(e.value, e.key, this); e?.removed; ) e = e.previous;
          },
          has: function (t) {
            return !!c(this, t);
          },
        }),
        Mo(
          i,
          r
            ? {
                get: function (t) {
                  const e = c(this, t);
                  return e?.value;
                },
                set: function (t, e) {
                  return s(this, 0 === t ? 0 : t, e);
                },
              }
            : {
                add: function (t) {
                  return s(this, (t = 0 === t ? 0 : t), t);
                },
              }
        ),
        u &&
          so(i, 'size', {
            configurable: !0,
            get: function () {
              return a(this).size;
            },
          }),
        o
      );
    },
    setStrong: (t, e, r) => {
      const n = `${e} Iterator`;
      const o = _o(e);
      const i = _o(n);
      Rn(
        t,
        e,
        function (t, e) {
          Co(this, { type: n, target: t, state: o(t), kind: e, last: null });
        },
        function () {
          for (let t = i(this), _e = t.kind, r = t.last; r?.removed; ) r = r.previous;
          return t.target && (t.last = r = r ? r.next : t.state.first)
            ? Pn('keys' === e ? r.key : 'values' === e ? r.value : [r.key, r.value], !1)
            : ((t.target = null), Pn(void 0, !0));
        },
        r ? 'entries' : 'values',
        !r,
        !0
      ),
        Uo(e);
    },
  };
  To(
    'Map',
    (t) =>
      function () {
        return t(this, arguments.length ? arguments[0] : void 0);
      },
    Fo
  );
  const Bo = Map.prototype;
  const Do = {
    Map: Map,
    set: b(Bo.set),
    get: b(Bo.get),
    has: b(Bo.has),
    remove: b(Bo.delete),
    proto: Bo,
  };
  const zo = Do.Map;
  const Wo = Do.has;
  const qo = Do.get;
  const Ho = Do.set;
  const $o = b([].push);
  const Ko = a(() => 1 !== zo.groupBy('ab', (t) => t).get('a').length);
  Ce(
    { target: 'Map', stat: !0, forced: Ko },
    {
      groupBy: (t, e) => {
        j(t), J(e);
        const r = new zo();
        let n = 0;
        return (
          Ao(t, (t) => {
            const o = e(t, n++);
            Wo(r, o) ? $o(qo(r, o), t) : Ho(r, o, [t]);
          }),
          r
        );
      },
    }
  );
  const Go = {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0,
  };
  const Vo = Et('span').classList;
  const Yo = Vo?.constructor?.prototype;
  const Xo = Yo === Object.prototype ? void 0 : Yo;
  const Jo = dt('iterator');
  const Qo = ro.values;
  const Zo = (t, e) => {
    if (t) {
      if (t[Jo] !== Qo)
        try {
          _t(t, Jo, Qo);
        } catch (_e) {
          t[Jo] = Qo;
        }
      if ((an(t, e, !0), Go[e]))
        for (const r in ro)
          if (t[r] !== ro[r])
            try {
              _t(t, r, ro[r]);
            } catch (_e) {
              t[r] = ro[r];
            }
    }
  };
  for (const ti in Go) Zo(i[ti]?.prototype, ti);
  Zo(Xo, 'DOMTokenList');
  const ei = (t, e, r) => (n) => {
    const o = it(n);
    const i = arguments.length;
    const a = i > 1 ? arguments[1] : void 0;
    const u = void 0 !== a;
    const s = u ? ar(a, i > 2 ? arguments[2] : void 0) : void 0;
    const c = new t();
    let f = 0;
    return (
      Ao(o, (t) => {
        const n = u ? s(t, f++) : t;
        r ? e(c, kt(n)[0], n[1]) : e(c, n);
      }),
      c
    );
  };
  Ce({ target: 'Map', stat: !0, forced: !0 }, { from: ei(Do.Map, Do.set, !0) });
  const ri = (t, e, r) => () => {
    for (let n = new t(), o = arguments.length, i = 0; i < o; i++) {
      const a = arguments[i];
      r ? e(n, kt(a)[0], a[1]) : e(n, a);
    }
    return n;
  };
  Ce({ target: 'Map', stat: !0, forced: !0 }, { of: ri(Do.Map, Do.set, !0) });
  const ni = Do.has;
  const oi = (t) => (ni(t), t);
  const ii = Do.remove;
  Ce(
    { target: 'Map', proto: !0, real: !0, forced: !0 },
    {
      deleteAll: function () {
        for (let t, e = oi(this), r = !0, n = 0, o = arguments.length; n < o; n++)
          (t = ii(e, arguments[n])), (r = r && t);
        return !!r;
      },
    }
  );
  const ai = Do.get;
  const ui = Do.has;
  const si = Do.set;
  Ce(
    { target: 'Map', proto: !0, real: !0, forced: !0 },
    {
      emplace: function (t, e) {
        let r;
        let n;
        const o = oi(this);
        return ui(o, t)
          ? ((r = ai(o, t)), 'update' in e && ((r = e.update(r, t, o)), si(o, t, r)), r)
          : ((n = e.insert(t, o)), si(o, t, n), n);
      },
    }
  );
  const ci = (t, e, r) => {
    for (let n, o, i = r ? t : t.iterator, a = t.next; !(n = f(a, i)).done; )
      if (void 0 !== (o = e(n.value))) return o;
  };
  const fi = Do.Map;
  const li = Do.proto;
  const hi = b(li.forEach);
  const pi = b(li.entries);
  const vi = pi(new fi()).next;
  const di = (t, e, r) => (r ? ci({ iterator: pi(t), next: vi }, (t) => e(t[1], t[0])) : hi(t, e));
  Ce(
    { target: 'Map', proto: !0, real: !0, forced: !0 },
    {
      every: function (t) {
        const e = oi(this);
        const r = ar(t, arguments.length > 1 ? arguments[1] : void 0);
        return (
          !1 !==
          di(
            e,
            (t, n) => {
              if (!r(t, n, e)) return !1;
            },
            !0
          )
        );
      },
    }
  );
  const gi = Do.Map;
  const yi = Do.set;
  Ce(
    { target: 'Map', proto: !0, real: !0, forced: !0 },
    {
      filter: function (t) {
        const e = oi(this);
        const r = ar(t, arguments.length > 1 ? arguments[1] : void 0);
        const n = new gi();
        return (
          di(e, (t, o) => {
            r(t, o, e) && yi(n, o, t);
          }),
          n
        );
      },
    }
  ),
    Ce(
      { target: 'Map', proto: !0, real: !0, forced: !0 },
      {
        find: function (t) {
          const e = oi(this);
          const r = ar(t, arguments.length > 1 ? arguments[1] : void 0);
          const n = di(
            e,
            (t, n) => {
              if (r(t, n, e)) return { value: t };
            },
            !0
          );
          return n?.value;
        },
      }
    ),
    Ce(
      { target: 'Map', proto: !0, real: !0, forced: !0 },
      {
        findKey: function (t) {
          const e = oi(this);
          const r = ar(t, arguments.length > 1 ? arguments[1] : void 0);
          const n = di(
            e,
            (t, n) => {
              if (r(t, n, e)) return { key: n };
            },
            !0
          );
          return n?.key;
        },
      }
    ),
    Ce(
      { target: 'Map', proto: !0, real: !0, forced: !0 },
      {
        includes: function (t) {
          return (
            !0 ===
            di(
              oi(this),
              (e) => {
                if ((r = e) === (n = t) || (r !== r && n !== n)) return !0;
                let r;
                let n;
              },
              !0
            )
          );
        },
      }
    );
  const mi = Do.Map;
  Ce(
    { target: 'Map', stat: !0, forced: !0 },
    {
      keyBy: function (t, e) {
        const r = new (T(this) ? this : mi)();
        J(e);
        const n = J(r.set);
        return (
          Ao(t, (t) => {
            f(n, r, e(t), t);
          }),
          r
        );
      },
    }
  ),
    Ce(
      { target: 'Map', proto: !0, real: !0, forced: !0 },
      {
        keyOf: function (t) {
          const e = di(
            oi(this),
            (e, r) => {
              if (e === t) return { key: r };
            },
            !0
          );
          return e?.key;
        },
      }
    );
  const bi = Do.Map;
  const wi = Do.set;
  Ce(
    { target: 'Map', proto: !0, real: !0, forced: !0 },
    {
      mapKeys: function (t) {
        const e = oi(this);
        const r = ar(t, arguments.length > 1 ? arguments[1] : void 0);
        const n = new bi();
        return (
          di(e, (t, o) => {
            wi(n, r(t, o, e), t);
          }),
          n
        );
      },
    }
  );
  const Si = Do.Map;
  const Ei = Do.set;
  Ce(
    { target: 'Map', proto: !0, real: !0, forced: !0 },
    {
      mapValues: function (t) {
        const e = oi(this);
        const r = ar(t, arguments.length > 1 ? arguments[1] : void 0);
        const n = new Si();
        return (
          di(e, (t, o) => {
            Ei(n, o, r(t, o, e));
          }),
          n
        );
      },
    }
  );
  const Oi = Do.set;
  Ce(
    { target: 'Map', proto: !0, real: !0, arity: 1, forced: !0 },
    {
      merge: function (_t) {
        for (let e = oi(this), r = arguments.length, n = 0; n < r; )
          Ao(
            arguments[n++],
            (t, r) => {
              Oi(e, t, r);
            },
            { AS_ENTRIES: !0 }
          );
        return e;
      },
    }
  );
  const xi = TypeError;
  Ce(
    { target: 'Map', proto: !0, real: !0, forced: !0 },
    {
      reduce: function (t) {
        const e = oi(this);
        let r = arguments.length < 2;
        let n = r ? void 0 : arguments[1];
        if (
          (J(t),
          di(e, (o, i) => {
            r ? ((r = !1), (n = o)) : (n = t(n, o, i, e));
          }),
          r)
        )
          throw new xi('Reduce of empty map with no initial value');
        return n;
      },
    }
  ),
    Ce(
      { target: 'Map', proto: !0, real: !0, forced: !0 },
      {
        some: function (t) {
          const e = oi(this);
          const r = ar(t, arguments.length > 1 ? arguments[1] : void 0);
          return (
            !0 ===
            di(
              e,
              (t, n) => {
                if (r(t, n, e)) return !0;
              },
              !0
            )
          );
        },
      }
    );
  const Ri = TypeError;
  const Pi = Do.get;
  const Ai = Do.has;
  const ji = Do.set;
  Ce(
    { target: 'Map', proto: !0, real: !0, forced: !0 },
    {
      update: function (t, e) {
        const r = oi(this);
        const n = arguments.length;
        J(e);
        const o = Ai(r, t);
        if (!o && n < 3) throw new Ri('Updating absent value');
        const i = o ? Pi(r, t) : J(n > 2 ? arguments[2] : void 0)(t, r);
        return ji(r, t, e(i, t, r)), r;
      },
    }
  );
  const ki = TypeError;
  const Ii = function (t, e) {
    let r;
    const n = kt(this);
    const o = J(n.get);
    const i = J(n.has);
    const a = J(n.set);
    const u = arguments.length > 2 ? arguments[2] : void 0;
    if (!T(e) && !T(u)) throw new ki('At least one callback required');
    return (
      f(i, n, t)
        ? ((r = f(o, n, t)), T(e) && ((r = e(r)), f(a, n, t, r)))
        : T(u) && ((r = u()), f(a, n, t, r)),
      r
    );
  };
  Ce({ target: 'Map', proto: !0, real: !0, forced: !0 }, { upsert: Ii }),
    Ce({ target: 'Map', proto: !0, real: !0, name: 'upsert', forced: !0 }, { updateOrInsert: Ii });
  const Ti = b((1).valueOf);
  const Mi = '\t\n\v\f\r                　\u2028\u2029\ufeff';
  const Li = b(''.replace);
  const Ui = RegExp(`^[${Mi}]+`);
  const Ni = RegExp(`(^|[^${Mi}])[${Mi}]+$`);
  const Ci = (t) => (e) => {
    let r = Wr(j(e));
    return 1 & t && (r = Li(r, Ui, '')), 2 & t && (r = Li(r, Ni, '$1')), r;
  };
  const _i = { start: Ci(1), end: Ci(2), trim: Ci(3) };
  const Fi = Oe.f;
  const Bi = Rt.f;
  const Di = Ct.f;
  const zi = _i.trim;
  const Wi = 'Number';
  const qi = i[Wi];
  const Hi = qi.prototype;
  const $i = i.TypeError;
  const Ki = b(''.slice);
  const Gi = b(''.charCodeAt);
  const Vi = Ue(Wi, !qi(' 0o1') || !qi('0b1') || qi('+0x1'));
  const Yi = function (t) {
    let e;
    const r =
      arguments.length < 1
        ? 0
        : qi(
            ((t) => {
              const e = mt(t, 'number');
              return 'bigint' === typeof e
                ? e
                : ((t) => {
                    let e;
                    let r;
                    let n;
                    let o;
                    let i;
                    let a;
                    let u;
                    let s;
                    let c = mt(t, 'number');
                    if (G(c)) throw new $i('Cannot convert a Symbol value to a number');
                    if ('string' === typeof c && c.length > 2)
                      if (((c = zi(c)), 43 === (e = Gi(c, 0)) || 45 === e)) {
                        if (88 === (r = Gi(c, 2)) || 120 === r) return Number.NaN;
                      } else if (48 === e) {
                        switch (Gi(c, 1)) {
                          case 66:
                          case 98:
                            (n = 2), (o = 49);
                            break;
                          case 79:
                          case 111:
                            (n = 8), (o = 55);
                            break;
                          default:
                            return +c;
                        }
                        for (a = (i = Ki(c, 2)).length, u = 0; u < a; u++)
                          if ((s = Gi(i, u)) < 48 || s > o) return Number.NaN;
                        return Number.parseInt(i, n);
                      }
                    return +c;
                  })(e);
            })(t)
          );
    return U(Hi, (e = this)) &&
      a(() => {
        Ti(e);
      })
      ? Io(Object(r), this, Yi)
      : r;
  };
  (Yi.prototype = Hi),
    Vi && (Hi.constructor = Yi),
    Ce({ global: !0, constructor: !0, wrap: !0, forced: Vi }, { Number: Yi }),
    Vi &&
      ((t, e) => {
        for (
          let r,
            n = u
              ? Fi(e)
              : 'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,fromString,range'.split(
                  ','
                ),
            o = 0;
          n.length > o;
          o++
        )
          ut(e, (r = n[o])) && !ut(t, r) && Di(t, r, Bi(e, r));
      })(Yn[Wi], qi),
    Ce({ target: 'Number', stat: !0, nonConfigurable: !0, nonWritable: !0 }, { EPSILON: 2 ** -52 });
  const Xi = i.isFinite;
  Ce(
    { target: 'Number', stat: !0 },
    { isFinite: Number.isFinite || ((t) => 'number' === typeof t && Xi(t)) }
  );
  const Ji = Math.floor;
  const Qi = Number.isInteger || ((t) => !M(t) && Number.isFinite(t) && Ji(t) === t);
  Ce({ target: 'Number', stat: !0 }, { isInteger: Qi }),
    Ce({ target: 'Number', stat: !0 }, { isNaN: (t) => t !== t });
  const Zi = Math.abs;
  Ce({ target: 'Number', stat: !0 }, { isSafeInteger: (t) => Qi(t) && Zi(t) <= 9007199254740991 }),
    Ce(
      { target: 'Number', stat: !0, nonConfigurable: !0, nonWritable: !0 },
      { MAX_SAFE_INTEGER: 9007199254740991 }
    ),
    Ce(
      { target: 'Number', stat: !0, nonConfigurable: !0, nonWritable: !0 },
      { MIN_SAFE_INTEGER: -9007199254740991 }
    );
  const ta = _i.trim;
  const ea = b(''.charAt);
  const ra = i.parseFloat;
  const na = i.Symbol;
  const oa = na?.iterator;
  const ia =
    1 / ra(`${Mi}-0`) !== Number.NEGATIVE_INFINITY ||
    (oa &&
      !a(() => {
        ra(Object(oa));
      }))
      ? (t) => {
          const e = ta(Wr(t));
          const r = ra(e);
          return 0 === r && '-' === ea(e, 0) ? -0 : r;
        }
      : ra;
  Ce({ target: 'Number', stat: !0, forced: Number.parseFloat !== ia }, { parseFloat: ia });
  const aa = _i.trim;
  const ua = i.parseInt;
  const sa = i.Symbol;
  const ca = sa?.iterator;
  const fa = /^[+-]?0x/i;
  const la = b(fa.exec);
  const ha =
    8 !== ua(`${Mi}08`) ||
    22 !== ua(`${Mi}0x16`) ||
    (ca &&
      !a(() => {
        ua(Object(ca));
      }))
      ? (t, e) => {
          const r = aa(Wr(t));
          return ua(r, e >>> 0 || (la(fa, r) ? 16 : 10));
        }
      : ua;
  Ce({ target: 'Number', stat: !0, forced: Number.parseInt !== ha }, { parseInt: ha });
  const pa = b(v.f);
  const va = b([].push);
  const da =
    u &&
    a(() => {
      const t = Object.create(null);
      return (t[2] = 2), !pa(t, 2);
    });
  const ga = (t) => (e) => {
    for (let r, n = k(e), o = _e(n), i = da && null === Qr(n), a = o.length, s = 0, c = []; a > s; )
      (r = o[s++]), (u && !(i ? r in n : pa(n, r))) || va(c, t ? [r, n[r]] : n[r]);
    return c;
  };
  const ya = { entries: ga(!0), values: ga(!1) };
  const ma = ya.entries;
  Ce({ target: 'Object', stat: !0 }, { entries: (t) => ma(t) }),
    Ce(
      { target: 'Object', stat: !0, sham: !u },
      {
        getOwnPropertyDescriptors: (t) => {
          for (let e, r, n = k(t), o = Rt.f, i = Pe(n), a = {}, u = 0; i.length > u; )
            void 0 !== (r = o(n, (e = i[u++]))) && Cn(a, e, r);
          return a;
        },
      }
    );
  const ba = a(() => {
    _e(1);
  });
  Ce({ target: 'Object', stat: !0, forced: ba }, { keys: (t) => _e(it(t)) });
  const wa = Object.is || ((t, e) => (t === e ? 0 !== t || 1 / t === 1 / e : t !== t && e !== e));
  Ce({ target: 'Object', stat: !0 }, { is: wa });
  const Sa = ya.values;
  Ce({ target: 'Object', stat: !0 }, { values: (t) => Sa(t) }),
    Ce({ target: 'Object', stat: !0 }, { hasOwn: ut });
  const Ea = Function.prototype;
  const Oa = Ea.apply;
  const xa = Ea.call;
  const Ra =
    ('object' === typeof Reflect && Reflect.apply) ||
    (s ? xa.bind(Oa) : () => xa.apply(Oa, arguments));
  const Pa = !a(() => {
    Reflect.apply(() => {});
  });
  Ce({ target: 'Reflect', stat: !0, forced: Pa }, { apply: (t, e, r) => Ra(J(t), e, kt(r)) });
  const Aa = Function;
  const ja = b([].concat);
  const ka = b([].join);
  const Ia = {};
  const Ta = s
    ? Aa.bind
    : function (t) {
        const e = J(this);
        const r = e.prototype;
        const n = vo(arguments, 1);
        const o = function () {
          const r = ja(n, vo(arguments));
          return this instanceof o
            ? ((t, e, r) => {
                if (!ut(Ia, e)) {
                  for (let n = [], o = 0; o < e; o++) n[o] = `a[${o}]`;
                  Ia[e] = Aa('C,a', `return new C(${ka(n, ',')})`);
                }
                return Ia[e](t, r);
              })(e, r.length, r)
            : e.apply(t, r);
        };
        return M(r) && (o.prototype = r), o;
      };
  const Ma = TypeError;
  const La = (t) => {
    if (Sr(t)) return t;
    throw new Ma(`${Y(t)} is not a constructor`);
  };
  const Ua = L('Reflect', 'construct');
  const Na = Object.prototype;
  const Ca = [].push;
  const _a = a(() => {
    function t() {}
    return !(Ua(() => {}, [], t) instanceof t);
  });
  const Fa = !a(() => {
    Ua(() => {});
  });
  const Ba = _a || Fa;
  Ce(
    { target: 'Reflect', stat: !0, forced: Ba, sham: Ba },
    {
      construct: (t, e) => {
        La(t), kt(e);
        const r = arguments.length < 3 ? t : La(arguments[2]);
        if (Fa && !_a) return Ua(t, e, r);
        if (t === r) {
          switch (e.length) {
            case 0:
              return new t();
            case 1:
              return new t(e[0]);
            case 2:
              return new t(e[0], e[1]);
            case 3:
              return new t(e[0], e[1], e[2]);
            case 4:
              return new t(e[0], e[1], e[2], e[3]);
          }
          const n = [null];
          return Ra(Ca, n, e), new (Ra(Ta, t, n))();
        }
        const o = r.prototype;
        const i = Ve(M(o) ? o : Na);
        const a = Ra(t, i, e);
        return M(a) ? a : i;
      },
    }
  );
  const Da = a(() => {
    Reflect.defineProperty(Ct.f({}, 1, { value: 1 }), 1, { value: 2 });
  });
  Ce(
    { target: 'Reflect', stat: !0, forced: Da, sham: !u },
    {
      defineProperty: (t, e, r) => {
        kt(t);
        const n = bt(e);
        kt(r);
        try {
          return Ct.f(t, n, r), !0;
        } catch (_t) {
          return !1;
        }
      },
    }
  );
  const za = Rt.f;
  Ce(
    { target: 'Reflect', stat: !0 },
    {
      deleteProperty: (t, e) => {
        const r = za(kt(t), e);
        return !(r && !r.configurable) && delete t[e];
      },
    }
  );
  const Wa = (t) => void 0 !== t && (ut(t, 'value') || ut(t, 'writable'));
  Ce(
    { target: 'Reflect', stat: !0 },
    {
      get: function t(e, r) {
        let n;
        let o;
        const i = arguments.length < 3 ? e : arguments[2];
        return kt(e) === i
          ? e[r]
          : (n = Rt.f(e, r))
            ? Wa(n)
              ? n.value
              : void 0 === n.get
                ? void 0
                : f(n.get, i)
            : M((o = Qr(e)))
              ? t(o, r, i)
              : void 0;
      },
    }
  ),
    Ce(
      { target: 'Reflect', stat: !0, sham: !u },
      { getOwnPropertyDescriptor: (t, e) => Rt.f(kt(t), e) }
    ),
    Ce({ target: 'Reflect', stat: !0, sham: !Vr }, { getPrototypeOf: (t) => Qr(kt(t)) }),
    Ce({ target: 'Reflect', stat: !0 }, { has: (t, e) => e in t }),
    Ce({ target: 'Reflect', stat: !0 }, { isExtensible: (t) => (kt(t), So(t)) }),
    Ce({ target: 'Reflect', stat: !0 }, { ownKeys: Pe }),
    Ce(
      { target: 'Reflect', stat: !0, sham: !Eo },
      {
        preventExtensions: (t) => {
          kt(t);
          try {
            const e = L('Object', 'preventExtensions');
            return e?.(t), !0;
          } catch (_t) {
            return !1;
          }
        },
      }
    );
  const qa = a(() => {
    const t = () => {};
    const e = Ct.f(new t(), 'a', { configurable: !0 });
    return !1 !== Reflect.set(t.prototype, 'a', 1, e);
  });
  Ce(
    { target: 'Reflect', stat: !0, forced: qa },
    {
      set: function t(e, r, n) {
        let o;
        let i;
        let a;
        const u = arguments.length < 4 ? e : arguments[3];
        let s = Rt.f(kt(e), r);
        if (!s) {
          if (M((i = Qr(e)))) return t(i, r, n, u);
          s = d(0);
        }
        if (Wa(s)) {
          if (!1 === s.writable || !M(u)) return !1;
          if ((o = Rt.f(u, r))) {
            if (o.get || o.set || !1 === o.writable) return !1;
            (o.value = n), Ct.f(u, r, o);
          } else Ct.f(u, r, d(0, n));
        } else {
          if (void 0 === (a = s.set)) return !1;
          f(a, u, n);
        }
        return !0;
      },
    }
  ),
    dn &&
      Ce(
        { target: 'Reflect', stat: !0 },
        {
          setPrototypeOf: (t, e) => {
            kt(t), vn(e);
            try {
              return dn(t, e), !0;
            } catch (_t) {
              return !1;
            }
          },
        }
      ),
    Ce({ global: !0 }, { Reflect: {} }),
    an(i.Reflect, 'Reflect', !0);
  const Ha = Oo.getWeakData;
  const $a = ne.set;
  const Ka = ne.getterFor;
  const Ga = Ar.find;
  const Va = Ar.findIndex;
  const Ya = b([].splice);
  let Xa = 0;
  const Ja = (t) => t.frozen || (t.frozen = new Qa());
  const Qa = function () {
    this.entries = [];
  };
  const Za = (t, e) => Ga(t.entries, (t) => t[0] === e);
  Qa.prototype = {
    get: function (t) {
      const e = Za(this, t);
      if (e) return e[1];
    },
    has: function (t) {
      return !!Za(this, t);
    },
    set: function (t, e) {
      const r = Za(this, t);
      r ? (r[1] = e) : this.entries.push([t, e]);
    },
    delete: function (t) {
      const e = Va(this.entries, (e) => e[0] === t);
      return ~e && Ya(this.entries, e, 1), !!~e;
    },
  };
  let tu;
  const eu = {
    getConstructor: (t, e, r, n) => {
      const o = t((t, o) => {
        ko(t, i),
          $a(t, { type: e, id: Xa++, frozen: null }),
          P(o) || Ao(o, t[n], { that: t, AS_ENTRIES: r });
      });
      const i = o.prototype;
      const a = Ka(e);
      const u = (t, e, r) => {
        const n = a(t);
        const o = Ha(kt(e), !0);
        return !0 === o ? Ja(n).set(e, r) : (o[n.id] = r), t;
      };
      return (
        Mo(i, {
          delete: function (t) {
            const e = a(this);
            if (!M(t)) return !1;
            const r = Ha(t);
            return !0 === r ? Ja(e).delete(t) : r && ut(r, e.id) && delete r[e.id];
          },
          has: function (t) {
            const e = a(this);
            if (!M(t)) return !1;
            const r = Ha(t);
            return !0 === r ? Ja(e).has(t) : r && ut(r, e.id);
          },
        }),
        Mo(
          i,
          r
            ? {
                get: function (t) {
                  const e = a(this);
                  if (M(t)) {
                    const r = Ha(t);
                    if (!0 === r) return Ja(e).get(t);
                    if (r) return r[e.id];
                  }
                },
                set: function (t, e) {
                  return u(this, t, e);
                },
              }
            : {
                add: function (t) {
                  return u(this, t, !0);
                },
              }
        ),
        o
      );
    },
  };
  const ru = ne.enforce;
  const nu = Object;
  const ou = Array.isArray;
  const iu = nu.isExtensible;
  const au = nu.isFrozen;
  const uu = nu.isSealed;
  const su = nu.freeze;
  const cu = nu.seal;
  const fu = !i.ActiveXObject && 'ActiveXObject' in i;
  const lu = (t) =>
    function () {
      return t(this, arguments.length ? arguments[0] : void 0);
    };
  const hu = To('WeakMap', lu, eu);
  const pu = hu.prototype;
  const vu = b(pu.set);
  if (Vt)
    if (fu) {
      (tu = eu.getConstructor(lu, 'WeakMap', !0)), Oo.enable();
      const du = b(pu.delete);
      const gu = b(pu.has);
      const yu = b(pu.get);
      Mo(pu, {
        delete: function (t) {
          if (M(t) && !iu(t)) {
            const e = ru(this);
            return e.frozen || (e.frozen = new tu()), du(this, t) || e.frozen.delete(t);
          }
          return du(this, t);
        },
        has: function (t) {
          if (M(t) && !iu(t)) {
            const e = ru(this);
            return e.frozen || (e.frozen = new tu()), gu(this, t) || e.frozen.has(t);
          }
          return gu(this, t);
        },
        get: function (t) {
          if (M(t) && !iu(t)) {
            const e = ru(this);
            return e.frozen || (e.frozen = new tu()), gu(this, t) ? yu(this, t) : e.frozen.get(t);
          }
          return yu(this, t);
        },
        set: function (t, e) {
          if (M(t) && !iu(t)) {
            const r = ru(this);
            r.frozen || (r.frozen = new tu()), gu(this, t) ? vu(this, t, e) : r.frozen.set(t, e);
          } else vu(this, t, e);
          return this;
        },
      });
    } else
      Eo &&
        a(() => {
          const t = su([]);
          return vu(new hu(), t, 1), !au(t);
        }) &&
        Mo(pu, {
          set: function (t, e) {
            let r;
            return ou(t) && (au(t) ? (r = su) : uu(t) && (r = cu)), vu(this, t, e), r?.(t), this;
          },
        });
  const mu = L('Map');
  const bu = L('WeakMap');
  const wu = b([].push);
  const Su = nt('metadata');
  const Eu = Su.store || (Su.store = new bu());
  const Ou = (t, e, r) => {
    let n = Eu.get(t);
    if (!n) {
      if (!r) return;
      Eu.set(t, (n = new mu()));
    }
    let o = n.get(e);
    if (!o) {
      if (!r) return;
      n.set(e, (o = new mu()));
    }
    return o;
  };
  const xu = {
    store: Eu,
    getMap: Ou,
    has: (t, e, r) => {
      const n = Ou(e, r, !1);
      return void 0 !== n && n.has(t);
    },
    get: (t, e, r) => {
      const n = Ou(e, r, !1);
      return void 0 === n ? void 0 : n.get(t);
    },
    set: (t, e, r, n) => {
      Ou(r, n, !0).set(t, e);
    },
    keys: (t, e) => {
      const r = Ou(t, e, !1);
      const n = [];
      return (
        r?.forEach((_t, e) => {
          wu(n, e);
        }),
        n
      );
    },
    toKey: (t) => (void 0 === t || 'symbol' === typeof t ? t : String(t)),
  };
  const Ru = xu.toKey;
  const Pu = xu.set;
  Ce(
    { target: 'Reflect', stat: !0 },
    {
      defineMetadata: (t, e, r) => {
        const n = arguments.length < 4 ? void 0 : Ru(arguments[3]);
        Pu(t, e, kt(r), n);
      },
    }
  );
  const Au = xu.toKey;
  const ju = xu.getMap;
  const ku = xu.store;
  Ce(
    { target: 'Reflect', stat: !0 },
    {
      deleteMetadata: (t, e) => {
        const r = arguments.length < 3 ? void 0 : Au(arguments[2]);
        const n = ju(kt(e), r, !1);
        if (void 0 === n || !n.delete(t)) return !1;
        if (n.size) return !0;
        const o = ku.get(e);
        return o.delete(r), !!o.size || ku.delete(e);
      },
    }
  );
  const Iu = xu.has;
  const Tu = xu.get;
  const Mu = xu.toKey;
  const Lu = (t, e, r) => {
    if (Iu(t, e, r)) return Tu(t, e, r);
    const n = Qr(e);
    return null !== n ? Lu(t, n, r) : void 0;
  };
  Ce(
    { target: 'Reflect', stat: !0 },
    {
      getMetadata: (t, e) => {
        const r = arguments.length < 3 ? void 0 : Mu(arguments[2]);
        return Lu(t, kt(e), r);
      },
    }
  );
  const Uu = Do.Map;
  const Nu = Do.has;
  const Cu = Do.set;
  const _u = b([].push);
  const Fu = b(function (t) {
    let e;
    let r;
    let n;
    const o = it(this);
    const i = de(o);
    const a = [];
    const u = new Uu();
    const s = P(t) ? (t) => t : J(t);
    for (e = 0; e < i; e++) (n = s((r = o[e]))), Nu(u, n) || Cu(u, n, r);
    return (
      di(u, (t) => {
        _u(a, t);
      }),
      a
    );
  });
  const Bu = b([].concat);
  const Du = xu.keys;
  const zu = xu.toKey;
  const Wu = (t, e) => {
    const r = Du(t, e);
    const n = Qr(t);
    if (null === n) return r;
    const o = Wu(n, e);
    return o.length ? (r.length ? Fu(Bu(r, o)) : o) : r;
  };
  Ce(
    { target: 'Reflect', stat: !0 },
    {
      getMetadataKeys: (t) => {
        const e = arguments.length < 2 ? void 0 : zu(arguments[1]);
        return Wu(kt(t), e);
      },
    }
  );
  const qu = xu.get;
  const Hu = xu.toKey;
  Ce(
    { target: 'Reflect', stat: !0 },
    {
      getOwnMetadata: (t, e) => {
        const r = arguments.length < 3 ? void 0 : Hu(arguments[2]);
        return qu(t, kt(e), r);
      },
    }
  );
  const $u = xu.keys;
  const Ku = xu.toKey;
  Ce(
    { target: 'Reflect', stat: !0 },
    {
      getOwnMetadataKeys: (t) => {
        const e = arguments.length < 2 ? void 0 : Ku(arguments[1]);
        return $u(kt(t), e);
      },
    }
  );
  const Gu = xu.has;
  const Vu = xu.toKey;
  const Yu = (t, e, r) => {
    if (Gu(t, e, r)) return !0;
    const n = Qr(e);
    return null !== n && Yu(t, n, r);
  };
  Ce(
    { target: 'Reflect', stat: !0 },
    {
      hasMetadata: (t, e) => {
        const r = arguments.length < 3 ? void 0 : Vu(arguments[2]);
        return Yu(t, kt(e), r);
      },
    }
  );
  const Xu = xu.has;
  const Ju = xu.toKey;
  Ce(
    { target: 'Reflect', stat: !0 },
    {
      hasOwnMetadata: (t, e) => {
        const r = arguments.length < 3 ? void 0 : Ju(arguments[2]);
        return Xu(t, kt(e), r);
      },
    }
  );
  const Qu = xu.toKey;
  const Zu = xu.set;
  Ce(
    { target: 'Reflect', stat: !0 },
    {
      metadata: (t, e) => (r, n) => {
        Zu(t, e, kt(r), Qu(n));
      },
    }
  );
  const ts = dt('match');
  const es = (t) => {
    let e;
    return M(t) && (void 0 !== (e = t[ts]) ? !!e : 'RegExp' === E(t));
  };
  const rs = function () {
    const t = kt(this);
    let e = '';
    return (
      t.hasIndices && (e += 'd'),
      t.global && (e += 'g'),
      t.ignoreCase && (e += 'i'),
      t.multiline && (e += 'm'),
      t.dotAll && (e += 's'),
      t.unicode && (e += 'u'),
      t.unicodeSets && (e += 'v'),
      t.sticky && (e += 'y'),
      e
    );
  };
  const ns = RegExp.prototype;
  const os = (t) => {
    const e = t.flags;
    return void 0 !== e || 'flags' in ns || ut(t, 'flags') || !U(ns, t) ? e : f(rs, t);
  };
  const is = i.RegExp;
  const as = a(() => {
    const t = is('a', 'y');
    return (t.lastIndex = 2), null !== t.exec('abcd');
  });
  const us = as || a(() => !is('a', 'y').sticky);
  const ss =
    as ||
    a(() => {
      const t = is('^r', 'gy');
      return (t.lastIndex = 2), null !== t.exec('str');
    });
  const cs = { BROKEN_CARET: ss, MISSED_STICKY: us, UNSUPPORTED_Y: as };
  const fs = Ct.f;
  const ls = (t, e, r) => {
    r in t ||
      fs(t, r, {
        configurable: !0,
        get: () => e[r],
        set: (t) => {
          e[r] = t;
        },
      });
  };
  const hs = i.RegExp;
  const ps = a(() => {
    const t = hs('.', 's');
    return !(t.dotAll && t.test('\n') && 's' === t.flags);
  });
  const vs = i.RegExp;
  const ds = a(() => {
    const t = vs('(?<a>b)', 'g');
    return 'b' !== t.exec('b').groups.a || 'bc' !== 'b'.replace(t, '$<a>c');
  });
  const gs = Oe.f;
  const ys = ne.enforce;
  const ms = dt('match');
  const bs = i.RegExp;
  const ws = bs.prototype;
  const Ss = i.SyntaxError;
  const Es = b(ws.exec);
  const Os = b(''.charAt);
  const xs = b(''.replace);
  const Rs = b(''.indexOf);
  const Ps = b(''.slice);
  const As = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
  const js = /a/g;
  const ks = /a/g;
  const Is = new bs(js) !== js;
  const Ts = cs.MISSED_STICKY;
  const Ms = cs.UNSUPPORTED_Y;
  const Ls =
    u &&
    (!Is ||
      Ts ||
      ps ||
      ds ||
      a(() => ((ks[ms] = !1), bs(js) !== js || bs(ks) === ks || '/a/i' !== String(bs(js, 'i')))));
  if (Ue('RegExp', Ls)) {
    for (
      let Us = function (t, e) {
          let r;
          let n;
          let o;
          let i;
          let a;
          let u;
          const s = U(ws, this);
          const c = es(t);
          const f = void 0 === e;
          let l = [];
          let h = t;
          if (!s && c && f && t.constructor === Us) return t;
          if (
            ((c || U(ws, t)) && ((t = t.source), f && (e = os(h))),
            (t = void 0 === t ? '' : Wr(t)),
            (e = void 0 === e ? '' : Wr(e)),
            (h = t),
            ps && 'dotAll' in js && (n = !!e && Rs(e, 's') > -1) && (e = xs(e, /s/g, '')),
            (r = e),
            Ts && 'sticky' in js && (o = !!e && Rs(e, 'y') > -1) && Ms && (e = xs(e, /y/g, '')),
            ds &&
              ((i = ((t) => {
                for (
                  let e,
                    r = t.length,
                    n = 0,
                    o = '',
                    i = [],
                    a = Ve(null),
                    u = !1,
                    s = !1,
                    c = 0,
                    f = '';
                  n <= r;
                  n++
                ) {
                  if ('\\' === (e = Os(t, n))) e += Os(t, ++n);
                  else if (']' === e) u = !1;
                  else if (!u)
                    switch (!0) {
                      case '[' === e:
                        u = !0;
                        break;
                      case '(' === e:
                        if (((o += e), '?:' === Ps(t, n + 1, n + 3))) continue;
                        Es(As, Ps(t, n + 1)) && ((n += 2), (s = !0)), c++;
                        continue;
                      case '>' === e && s:
                        if ('' === f || ut(a, f)) throw new Ss('Invalid capture group name');
                        (a[f] = !0), (i[i.length] = [f, c]), (s = !1), (f = '');
                        continue;
                    }
                  s ? (f += e) : (o += e);
                }
                return [o, i];
              })(t)),
              (t = i[0]),
              (l = i[1])),
            (a = Io(bs(t, e), s ? this : ws, Us)),
            (n || o || l.length) &&
              ((u = ys(a)),
              n &&
                ((u.dotAll = !0),
                (u.raw = Us(
                  ((t) => {
                    for (let e, r = t.length, n = 0, o = '', i = !1; n <= r; n++)
                      '\\' !== (e = Os(t, n))
                        ? i || '.' !== e
                          ? ('[' === e ? (i = !0) : ']' === e && (i = !1), (o += e))
                          : (o += '[\\s\\S]')
                        : (o += e + Os(t, ++n));
                    return o;
                  })(t),
                  r
                ))),
              o && (u.sticky = !0),
              l.length && (u.groups = l)),
            t !== h)
          )
            try {
              _t(a, 'source', '' === h ? '(?:)' : h);
            } catch (_t) {}
          return a;
        },
        Ns = gs(bs),
        Cs = 0;
      Ns.length > Cs;
    )
      ls(Us, bs, Ns[Cs++]);
    (ws.constructor = Us), (Us.prototype = ws), ie(i, 'RegExp', Us, { constructor: !0 });
  }
  Uo('RegExp');
  const _s = zt.PROPER;
  const Fs = 'toString';
  const Bs = RegExp.prototype;
  const Ds = Bs[Fs];
  (a(() => '/a/b' !== Ds.call({ source: 'a', flags: 'b' })) || (_s && Ds.name !== Fs)) &&
    ie(
      Bs,
      Fs,
      function () {
        const t = kt(this);
        return `/${Wr(t.source)}/${Wr(os(t))}`;
      },
      { unsafe: !0 }
    );
  const zs = ne.get;
  const Ws = RegExp.prototype;
  const qs = TypeError;
  u &&
    ps &&
    so(Ws, 'dotAll', {
      configurable: !0,
      get: function () {
        if (this !== Ws) {
          if ('RegExp' === E(this)) return !!zs(this).dotAll;
          throw new qs('Incompatible receiver, RegExp required');
        }
      },
    });
  const Hs = ne.get;
  const $s = nt('native-string-replace', String.prototype.replace);
  const Ks = RegExp.prototype.exec;
  let Gs = Ks;
  const Vs = b(''.charAt);
  const Ys = b(''.indexOf);
  const Xs = b(''.replace);
  const Js = b(''.slice);
  const Qs = (() => {
    const t = /a/;
    const e = /b*/g;
    return f(Ks, t, 'a'), f(Ks, e, 'a'), 0 !== t.lastIndex || 0 !== e.lastIndex;
  })();
  const Zs = cs.BROKEN_CARET;
  const tc = void 0 !== /()??/.exec('')[1];
  (Qs || tc || Zs || ps || ds) &&
    (Gs = function (t) {
      let e;
      let r;
      let n;
      let o;
      let i;
      let a;
      let u;
      const c = Hs(this);
      const l = Wr(t);
      const h = c.raw;
      if (h)
        return (h.lastIndex = this.lastIndex), (e = f(Gs, h, l)), (this.lastIndex = h.lastIndex), e;
      const p = c.groups;
      const v = Zs && this.sticky;
      let d = f(rs, this);
      let g = this.source;
      let y = 0;
      let m = l;
      if (
        (v &&
          ((d = Xs(d, 'y', '')),
          -1 === Ys(d, 'g') && (d += 'g'),
          (m = Js(l, this.lastIndex)),
          this.lastIndex > 0 &&
            (!this.multiline || (this.multiline && '\n' !== Vs(l, this.lastIndex - 1))) &&
            ((g = `(?: ${g})`), (m = ` ${m}`), y++),
          (r = new RegExp(`^(?:${g})`, d))),
        tc && (r = new RegExp(`^${g}$(?!\\s)`, d)),
        Qs && (n = this.lastIndex),
        (o = f(Ks, v ? r : this, m)),
        v
          ? o
            ? ((o.input = Js(o.input, y)),
              (o[0] = Js(o[0], y)),
              (o.index = this.lastIndex),
              (this.lastIndex += o[0].length))
            : (this.lastIndex = 0)
          : Qs && o && (this.lastIndex = this.global ? o.index + o[0].length : n),
        tc &&
          o &&
          o.length > 1 &&
          f($s, o[0], r, () => {
            for (i = 1; i < arguments.length - 2; i++) void 0 === arguments[i] && (o[i] = void 0);
          }),
        o && p)
      )
        for (o.groups = a = Ve(null), i = 0; i < p.length; i++) a[(u = p[i])[0]] = o[u[1]];
      return o;
    });
  const ec = Gs;
  Ce({ target: 'RegExp', proto: !0, forced: /./.exec !== ec }, { exec: ec });
  const rc = i.RegExp;
  const nc = rc.prototype;
  u &&
    a(() => {
      let t = !0;
      try {
        rc('.', 'd');
      } catch (_e) {
        t = !1;
      }
      const e = {};
      let r = '';
      const n = t ? 'dgimsy' : 'gimsy';
      const o = (t, n) => {
        Object.defineProperty(e, t, { get: () => ((r += n), !0) });
      };
      const i = { dotAll: 's', global: 'g', ignoreCase: 'i', multiline: 'm', sticky: 'y' };
      for (const a in (t && (i.hasIndices = 'd'), i)) o(a, i[a]);
      return Object.getOwnPropertyDescriptor(nc, 'flags').get.call(e) !== n || r !== n;
    }) &&
    so(nc, 'flags', { configurable: !0, get: rs });
  const oc = ne.get;
  const ic = RegExp.prototype;
  const ac = TypeError;
  u &&
    cs.MISSED_STICKY &&
    so(ic, 'sticky', {
      configurable: !0,
      get: function () {
        if (this !== ic) {
          if ('RegExp' === E(this)) return !!oc(this).sticky;
          throw new ac('Incompatible receiver, RegExp required');
        }
      },
    });
  let uc;
  let sc;
  const cc =
    ((uc = !1),
    ((sc = /[ac]/).exec = function () {
      return (uc = !0), /./.exec.apply(this, arguments);
    }),
    !0 === sc.test('abc') && uc);
  const fc = /./.test;
  Ce(
    { target: 'RegExp', proto: !0, forced: !cc },
    {
      test: function (t) {
        const e = kt(this);
        const r = Wr(t);
        const n = e.exec;
        if (!T(n)) return f(fc, e, r);
        const o = f(n, e, r);
        return null !== o && (kt(o), !0);
      },
    }
  );
  const lc = dt('species');
  const hc = RegExp.prototype;
  const pc = (t, e, r, n) => {
    const o = dt(t);
    const i = !a(() => {
      const e = {};
      return (e[o] = () => 7), 7 !== ''[t](e);
    });
    const u =
      i &&
      !a(() => {
        let e = !1;
        let r = /a/;
        return (
          'split' === t &&
            (((r = {}).constructor = {}),
            (r.constructor[lc] = () => r),
            (r.flags = ''),
            (r[o] = /./[o])),
          (r.exec = () => ((e = !0), null)),
          r[o](''),
          !e
        );
      });
    if (!i || !u || r) {
      const s = /./[o];
      const c = e(o, ''[t], (t, e, r, n, o) => {
        const a = e.exec;
        return a === ec || a === hc.exec
          ? i && !o
            ? { done: !0, value: f(s, e, r, n) }
            : { done: !0, value: f(t, r, e, n) }
          : { done: !1 };
      });
      ie(String.prototype, t, c[0]), ie(hc, o, c[1]);
    }
    n && _t(hc[o], 'sham', !0);
  };
  const vc = Gr.charAt;
  const dc = (t, e, r) => e + (r ? vc(t, e).length : 1);
  const gc = TypeError;
  const yc = (t, e) => {
    const r = t.exec;
    if (T(r)) {
      const n = f(r, t, e);
      return null !== n && kt(n), n;
    }
    if ('RegExp' === E(t)) return f(ec, t, e);
    throw new gc('RegExp#exec called on incompatible receiver');
  };
  pc('match', (t, e, r) => [
    function (e) {
      const r = j(this);
      const n = P(e) ? void 0 : Q(e, t);
      return n ? f(n, e, r) : new RegExp(e)[t](Wr(r));
    },
    function (t) {
      const n = kt(this);
      const o = Wr(t);
      const i = r(e, n, o);
      if (i.done) return i.value;
      if (!n.global) return yc(n, o);
      const a = n.unicode;
      n.lastIndex = 0;
      for (let u, s = [], c = 0; null !== (u = yc(n, o)); ) {
        const f = Wr(u[0]);
        (s[c] = f), '' === f && (n.lastIndex = dc(o, ve(n.lastIndex), a)), c++;
      }
      return 0 === c ? null : s;
    },
  ]);
  const mc = Math.floor;
  const bc = b(''.charAt);
  const wc = b(''.replace);
  const Sc = b(''.slice);
  const Ec = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
  const Oc = /\$([$&'`]|\d{1,2})/g;
  const xc = (t, e, r, n, o, i) => {
    const a = r + t.length;
    const u = n.length;
    let s = Oc;
    return (
      void 0 !== o && ((o = it(o)), (s = Ec)),
      wc(i, s, (i, s) => {
        let c;
        switch (bc(s, 0)) {
          case '$':
            return '$';
          case '&':
            return t;
          case '`':
            return Sc(e, 0, r);
          case "'":
            return Sc(e, a);
          case '<':
            c = o[Sc(s, 1, -1)];
            break;
          default: {
            const f = +s;
            if (0 === f) return i;
            if (f > u) {
              const l = mc(f / 10);
              return 0 === l
                ? i
                : l <= u
                  ? void 0 === n[l - 1]
                    ? bc(s, 1)
                    : n[l - 1] + bc(s, 1)
                  : i;
            }
            c = n[f - 1];
          }
        }
        return void 0 === c ? '' : c;
      })
    );
  };
  const Rc = dt('replace');
  const Pc = Math.max;
  const Ac = Math.min;
  const jc = b([].concat);
  const kc = b([].push);
  const Ic = b(''.indexOf);
  const Tc = b(''.slice);
  const Mc = '$0' === 'a'.replace(/./, '$0');
  const Lc = !!/./[Rc] && '' === /./[Rc]('a', '$0');
  const Uc = !a(() => {
    const t = /./;
    return (
      (t.exec = () => {
        const t = [];
        return (t.groups = { a: '7' }), t;
      }),
      '7' !== ''.replace(t, '$<a>')
    );
  });
  pc(
    'replace',
    (_t, e, r) => {
      const n = Lc ? '$' : '$0';
      return [
        function (t, r) {
          const n = j(this);
          const o = P(t) ? void 0 : Q(t, Rc);
          return o ? f(o, t, n, r) : f(e, Wr(n), t, r);
        },
        function (t, o) {
          const i = kt(this);
          const a = Wr(t);
          if ('string' === typeof o && -1 === Ic(o, n) && -1 === Ic(o, '$<')) {
            const u = r(e, i, a, o);
            if (u.done) return u.value;
          }
          const s = T(o);
          s || (o = Wr(o));
          let c;
          const f = i.global;
          f && ((c = i.unicode), (i.lastIndex = 0));
          for (let l, h = []; null !== (l = yc(i, a)) && (kc(h, l), f); )
            '' === Wr(l[0]) && (i.lastIndex = dc(a, ve(i.lastIndex), c));
          for (let p, v = '', d = 0, g = 0; g < h.length; g++) {
            for (
              let _y, _m = Wr((l = h[g])[0]), _b = Pc(Ac(ce(l.index), a.length), 0), w = [], S = 1;
              S < l.length;
              S++
            )
              kc(w, void 0 === (p = l[S]) ? p : String(p));
            const E = l.groups;
            if (s) {
              const O = jc([m], w, b, a);
              void 0 !== E && kc(O, E), (y = Wr(Ra(o, void 0, O)));
            } else y = xc(m, a, b, w, E, o);
            b >= d && ((v += Tc(a, d, b) + y), (d = b + m.length));
          }
          return v + Tc(a, d);
        },
      ];
    },
    !Uc || !Mc || Lc
  ),
    pc('search', (t, e, r) => [
      function (e) {
        const r = j(this);
        const n = P(e) ? void 0 : Q(e, t);
        return n ? f(n, e, r) : new RegExp(e)[t](Wr(r));
      },
      function (t) {
        const n = kt(this);
        const o = Wr(t);
        const i = r(e, n, o);
        if (i.done) return i.value;
        const a = n.lastIndex;
        wa(a, 0) || (n.lastIndex = 0);
        const u = yc(n, o);
        return wa(n.lastIndex, a) || (n.lastIndex = a), null === u ? -1 : u.index;
      },
    ]);
  const Nc = dt('species');
  const Cc = (t, e) => {
    let r;
    const n = kt(t).constructor;
    return void 0 === n || P((r = kt(n)[Nc])) ? e : La(r);
  };
  const _c = cs.UNSUPPORTED_Y;
  const Fc = Math.min;
  const Bc = b([].push);
  const Dc = b(''.slice);
  const zc = !a(() => {
    const t = /(?:)/;
    const e = t.exec;
    t.exec = function () {
      return e.apply(this, arguments);
    };
    const r = 'ab'.split(t);
    return 2 !== r.length || 'a' !== r[0] || 'b' !== r[1];
  });
  const Wc =
    'c' === 'abbc'.split(/(b)*/)[1] ||
    4 !== 'test'.split(/(?:)/, -1).length ||
    2 !== 'ab'.split(/(?:ab)*/).length ||
    4 !== '.'.split(/(.?)(.?)/).length ||
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length;
  pc(
    'split',
    (t, e, r) => {
      const n = '0'.split(void 0, 0).length
        ? function (t, r) {
            return void 0 === t && 0 === r ? [] : f(e, this, t, r);
          }
        : e;
      return [
        function (e, r) {
          const o = j(this);
          const i = P(e) ? void 0 : Q(e, t);
          return i ? f(i, e, o, r) : f(n, Wr(o), e, r);
        },
        function (t, o) {
          const i = kt(this);
          const a = Wr(t);
          if (!Wc) {
            const u = r(n, i, a, o, n !== e);
            if (u.done) return u.value;
          }
          const s = Cc(i, RegExp);
          const c = i.unicode;
          const f = new s(
            _c ? `^(?:${i.source})` : i,
            (i.ignoreCase ? 'i' : '') +
              (i.multiline ? 'm' : '') +
              (i.unicode ? 'u' : '') +
              (_c ? 'g' : 'y')
          );
          const l = void 0 === o ? 4294967295 : o >>> 0;
          if (0 === l) return [];
          if (0 === a.length) return null === yc(f, a) ? [a] : [];
          for (let h = 0, p = 0, v = []; p < a.length; ) {
            f.lastIndex = _c ? 0 : p;
            let d;
            const g = yc(f, _c ? Dc(a, p) : a);
            if (null === g || (d = Fc(ve(f.lastIndex + (_c ? p : 0)), a.length)) === h)
              p = dc(a, p, c);
            else {
              if ((Bc(v, Dc(a, h, p)), v.length === l)) return v;
              for (let y = 1; y <= g.length - 1; y++) if ((Bc(v, g[y]), v.length === l)) return v;
              p = h = d;
            }
          }
          return Bc(v, Dc(a, h)), v;
        },
      ];
    },
    Wc || !zc,
    _c
  );
  const qc = TypeError;
  const Hc = RangeError;
  const $c = function (t) {
    let e = Wr(j(this));
    let r = '';
    let n = ce(t);
    if (n < 0 || Number.POSITIVE_INFINITY === n) throw new Hc('Wrong number of repetitions');
    for (; n > 0; (n >>>= 1) && (e += e)) 1 & n && (r += e);
    return r;
  };
  const Kc = b($c);
  const Gc = b(''.slice);
  const Vc = Math.ceil;
  const Yc = (t) => (e, r, n) => {
    let o;
    let i;
    const a = Wr(j(e));
    const u = ve(r);
    const s = a.length;
    const c = void 0 === n ? ' ' : Wr(n);
    return u <= s || '' === c
      ? a
      : ((i = Kc(c, Vc((o = u - s) / c.length))).length > o && (i = Gc(i, 0, o)),
        t ? a + i : i + a);
  };
  const Xc = { start: Yc(!1), end: Yc(!0) };
  const Jc = Xc.start;
  const Qc = Array;
  const Zc = RegExp.escape;
  const tf = b(''.charAt);
  const ef = b(''.charCodeAt);
  const rf = b((1.1).toString);
  const nf = b([].join);
  const of = /^[0-9a-z]/i;
  const af = /^[$()*+./?[\\\]^{|}]/;
  const uf = RegExp(`^[!"#%&',\\-:;<=>@\`~${Mi}]`);
  const sf = b(of.exec);
  const cf = { '\t': 't', '\n': 'n', '\v': 'v', '\f': 'f', '\r': 'r' };
  const ff = (t) => {
    const e = rf(ef(t, 0), 16);
    return e.length < 3 ? `\\x${Jc(e, 2, '0')}` : `\\u${Jc(e, 4, '0')}`;
  };
  const lf = !Zc || '\\x61b' !== Zc('ab');
  Ce(
    { target: 'RegExp', stat: !0, forced: lf },
    {
      escape: (t) => {
        !((t) => {
          if ('string' === typeof t) return t;
          throw new qc('Argument is not a string');
        })(t);
        for (let e = t.length, r = Qc(e), n = 0; n < e; n++) {
          const o = tf(t, n);
          if (0 === n && sf(of, o)) r[n] = ff(o);
          else if (ut(cf, o)) r[n] = `\\${cf[o]}`;
          else if (sf(af, o)) r[n] = `\\${o}`;
          else if (sf(uf, o)) r[n] = ff(o);
          else {
            const i = ef(o, 0);
            55296 !== (63488 & i)
              ? (r[n] = o)
              : i >= 56320 || n + 1 >= e || 56320 !== (64512 & ef(t, n + 1))
                ? (r[n] = ff(o))
                : ((r[n] = o), (r[++n] = tf(t, n)));
          }
        }
        return nf(r, '');
      },
    }
  ),
    To(
      'Set',
      (t) =>
        function () {
          return t(this, arguments.length ? arguments[0] : void 0);
        },
      Fo
    );
  const hf = Set.prototype;
  const pf = { Set: Set, add: b(hf.add), has: b(hf.has), remove: b(hf.delete), proto: hf };
  const vf = pf.has;
  const df = (t) => (vf(t), t);
  const gf = pf.Set;
  const yf = pf.proto;
  const mf = b(yf.forEach);
  const bf = b(yf.keys);
  const wf = bf(new gf()).next;
  const Sf = (t, e, r) => (r ? ci({ iterator: bf(t), next: wf }, e) : mf(t, e));
  const Ef = pf.Set;
  const Of = pf.add;
  const xf = (t) => {
    const e = new Ef();
    return (
      Sf(t, (t) => {
        Of(e, t);
      }),
      e
    );
  };
  const Rf = ln(pf.proto, 'size', 'get') || ((t) => t.size);
  const Pf = 'Invalid size';
  const Af = RangeError;
  const jf = TypeError;
  const kf = Math.max;
  const If = function (t, e) {
    (this.set = t), (this.size = kf(e, 0)), (this.has = J(t.has)), (this.keys = J(t.keys));
  };
  If.prototype = {
    getIterator: function () {
      return { iterator: (t = kt(f(this.keys, this.set))), next: t.next, done: !1 };
      let t;
    },
    includes: function (t) {
      return f(this.has, this.set, t);
    },
  };
  const Tf = (t) => {
    kt(t);
    const e = +t.size;
    if (e !== e) throw new jf(Pf);
    const r = ce(e);
    if (r < 0) throw new Af(Pf);
    return new If(t, r);
  };
  const Mf = pf.has;
  const Lf = pf.remove;
  const Uf = function (t) {
    const e = df(this);
    const r = Tf(t);
    const n = xf(e);
    return (
      Rf(e) <= r.size
        ? Sf(e, (t) => {
            r.includes(t) && Lf(n, t);
          })
        : ci(r.getIterator(), (t) => {
            Mf(e, t) && Lf(n, t);
          }),
      n
    );
  };
  const Nf = (t) => ({ size: t, has: () => !1, keys: () => ({ next: () => ({ done: !0 }) }) });
  const Cf = (t) => {
    const e = L('Set');
    try {
      new e()[t](Nf(0));
      try {
        return new e()[t](Nf(-1)), !1;
      } catch (_t) {
        return !0;
      }
    } catch (_t) {
      return !1;
    }
  };
  Ce({ target: 'Set', proto: !0, real: !0, forced: !Cf('difference') }, { difference: Uf });
  const _f = pf.Set;
  const Ff = pf.add;
  const Bf = pf.has;
  const Df = function (t) {
    const e = df(this);
    const r = Tf(t);
    const n = new _f();
    return (
      Rf(e) > r.size
        ? ci(r.getIterator(), (t) => {
            Bf(e, t) && Ff(n, t);
          })
        : Sf(e, (t) => {
            r.includes(t) && Ff(n, t);
          }),
      n
    );
  };
  const zf =
    !Cf('intersection') ||
    a(() => '3,2' !== String(Array.from(new Set([1, 2, 3]).intersection(new Set([3, 2])))));
  Ce({ target: 'Set', proto: !0, real: !0, forced: zf }, { intersection: Df });
  const Wf = pf.has;
  const qf = function (t) {
    const e = df(this);
    const r = Tf(t);
    if (Rf(e) <= r.size)
      return (
        !1 !==
        Sf(
          e,
          (t) => {
            if (r.includes(t)) return !1;
          },
          !0
        )
      );
    const n = r.getIterator();
    return (
      !1 !==
      ci(n, (t) => {
        if (Wf(e, t)) return Tn(n, 'normal', !1);
      })
    );
  };
  Ce({ target: 'Set', proto: !0, real: !0, forced: !Cf('isDisjointFrom') }, { isDisjointFrom: qf });
  const Hf = function (t) {
    const e = df(this);
    const r = Tf(t);
    return (
      !(Rf(e) > r.size) &&
      !1 !==
        Sf(
          e,
          (t) => {
            if (!r.includes(t)) return !1;
          },
          !0
        )
    );
  };
  Ce({ target: 'Set', proto: !0, real: !0, forced: !Cf('isSubsetOf') }, { isSubsetOf: Hf });
  const $f = pf.has;
  const Kf = function (t) {
    const e = df(this);
    const r = Tf(t);
    if (Rf(e) < r.size) return !1;
    const n = r.getIterator();
    return (
      !1 !==
      ci(n, (t) => {
        if (!$f(e, t)) return Tn(n, 'normal', !1);
      })
    );
  };
  Ce({ target: 'Set', proto: !0, real: !0, forced: !Cf('isSupersetOf') }, { isSupersetOf: Kf });
  const Gf = pf.add;
  const Vf = pf.has;
  const Yf = pf.remove;
  const Xf = function (t) {
    const e = df(this);
    const r = Tf(t).getIterator();
    const n = xf(e);
    return (
      ci(r, (t) => {
        Vf(e, t) ? Yf(n, t) : Gf(n, t);
      }),
      n
    );
  };
  Ce(
    { target: 'Set', proto: !0, real: !0, forced: !Cf('symmetricDifference') },
    { symmetricDifference: Xf }
  );
  const Jf = pf.add;
  const Qf = function (t) {
    const e = df(this);
    const r = Tf(t).getIterator();
    const n = xf(e);
    return (
      ci(r, (t) => {
        Jf(n, t);
      }),
      n
    );
  };
  Ce({ target: 'Set', proto: !0, real: !0, forced: !Cf('union') }, { union: Qf }),
    Ce({ target: 'Set', stat: !0, forced: !0 }, { from: ei(pf.Set, pf.add, !1) }),
    Ce({ target: 'Set', stat: !0, forced: !0 }, { of: ri(pf.Set, pf.add, !1) });
  const Zf = pf.add;
  Ce(
    { target: 'Set', proto: !0, real: !0, forced: !0 },
    {
      addAll: function () {
        for (let t = df(this), e = 0, r = arguments.length; e < r; e++) Zf(t, arguments[e]);
        return t;
      },
    }
  );
  const tl = pf.remove;
  Ce(
    { target: 'Set', proto: !0, real: !0, forced: !0 },
    {
      deleteAll: function () {
        for (let t, e = df(this), r = !0, n = 0, o = arguments.length; n < o; n++)
          (t = tl(e, arguments[n])), (r = r && t);
        return !!r;
      },
    }
  ),
    Ce(
      { target: 'Set', proto: !0, real: !0, forced: !0 },
      {
        every: function (t) {
          const e = df(this);
          const r = ar(t, arguments.length > 1 ? arguments[1] : void 0);
          return (
            !1 !==
            Sf(
              e,
              (t) => {
                if (!r(t, t, e)) return !1;
              },
              !0
            )
          );
        },
      }
    );
  const el = dt('iterator');
  const rl = Object;
  const nl = L('Set');
  const ol = (t) =>
    ((t) => M(t) && 'number' === typeof t.size && T(t.has) && T(t.keys))(t)
      ? t
      : ((t) => {
            if (P(t)) return !1;
            const e = rl(t);
            return void 0 !== e[el] || '@@iterator' in e || ut(un, pr(e));
          })(t)
        ? new nl(t)
        : t;
  Ce(
    { target: 'Set', proto: !0, real: !0, forced: !0 },
    {
      difference: function (t) {
        return f(Uf, this, ol(t));
      },
    }
  );
  const il = pf.Set;
  const al = pf.add;
  Ce(
    { target: 'Set', proto: !0, real: !0, forced: !0 },
    {
      filter: function (t) {
        const e = df(this);
        const r = ar(t, arguments.length > 1 ? arguments[1] : void 0);
        const n = new il();
        return (
          Sf(e, (t) => {
            r(t, t, e) && al(n, t);
          }),
          n
        );
      },
    }
  ),
    Ce(
      { target: 'Set', proto: !0, real: !0, forced: !0 },
      {
        find: function (t) {
          const e = df(this);
          const r = ar(t, arguments.length > 1 ? arguments[1] : void 0);
          const n = Sf(
            e,
            (t) => {
              if (r(t, t, e)) return { value: t };
            },
            !0
          );
          return n?.value;
        },
      }
    ),
    Ce(
      { target: 'Set', proto: !0, real: !0, forced: !0 },
      {
        intersection: function (t) {
          return f(Df, this, ol(t));
        },
      }
    ),
    Ce(
      { target: 'Set', proto: !0, real: !0, forced: !0 },
      {
        isDisjointFrom: function (t) {
          return f(qf, this, ol(t));
        },
      }
    ),
    Ce(
      { target: 'Set', proto: !0, real: !0, forced: !0 },
      {
        isSubsetOf: function (t) {
          return f(Hf, this, ol(t));
        },
      }
    ),
    Ce(
      { target: 'Set', proto: !0, real: !0, forced: !0 },
      {
        isSupersetOf: function (t) {
          return f(Kf, this, ol(t));
        },
      }
    );
  const ul = b([].join);
  const sl = b([].push);
  Ce(
    { target: 'Set', proto: !0, real: !0, forced: !0 },
    {
      join: function (t) {
        const e = df(this);
        const r = void 0 === t ? ',' : Wr(t);
        const n = [];
        return (
          Sf(e, (t) => {
            sl(n, t);
          }),
          ul(n, r)
        );
      },
    }
  );
  const cl = pf.Set;
  const fl = pf.add;
  Ce(
    { target: 'Set', proto: !0, real: !0, forced: !0 },
    {
      map: function (t) {
        const e = df(this);
        const r = ar(t, arguments.length > 1 ? arguments[1] : void 0);
        const n = new cl();
        return (
          Sf(e, (t) => {
            fl(n, r(t, t, e));
          }),
          n
        );
      },
    }
  );
  const ll = TypeError;
  Ce(
    { target: 'Set', proto: !0, real: !0, forced: !0 },
    {
      reduce: function (t) {
        const e = df(this);
        let r = arguments.length < 2;
        let n = r ? void 0 : arguments[1];
        if (
          (J(t),
          Sf(e, (o) => {
            r ? ((r = !1), (n = o)) : (n = t(n, o, o, e));
          }),
          r)
        )
          throw new ll('Reduce of empty set with no initial value');
        return n;
      },
    }
  ),
    Ce(
      { target: 'Set', proto: !0, real: !0, forced: !0 },
      {
        some: function (t) {
          const e = df(this);
          const r = ar(t, arguments.length > 1 ? arguments[1] : void 0);
          return (
            !0 ===
            Sf(
              e,
              (t) => {
                if (r(t, t, e)) return !0;
              },
              !0
            )
          );
        },
      }
    ),
    Ce(
      { target: 'Set', proto: !0, real: !0, forced: !0 },
      {
        symmetricDifference: function (t) {
          return f(Xf, this, ol(t));
        },
      }
    ),
    Ce(
      { target: 'Set', proto: !0, real: !0, forced: !0 },
      {
        union: function (t) {
          return f(Qf, this, ol(t));
        },
      }
    );
  const hl = dt('species');
  const pl = dt('isConcatSpreadable');
  const vl =
    W >= 51 ||
    !a(() => {
      const t = [];
      return (t[pl] = !1), t.concat()[0] !== t;
    });
  const dl = (t) => {
    if (!M(t)) return !1;
    const e = t[pl];
    return void 0 !== e ? !!e : ur(t);
  };
  const gl = !(
    vl &&
    (W >= 51 ||
      !a(() => {
        const t = [];
        return ((t.constructor = {})[hl] = () => ({ foo: 1 })), 1 !== t.concat(Boolean).foo;
      }))
  );
  Ce(
    { target: 'Array', proto: !0, arity: 1, forced: gl },
    {
      concat: function (_t) {
        let e;
        let r;
        let n;
        let o;
        let i;
        const a = it(this);
        const u = xr(a, 0);
        let s = 0;
        for (e = -1, n = arguments.length; e < n; e++)
          if (dl((i = -1 === e ? a : arguments[e])))
            for (o = de(i), Nr(s + o), r = 0; r < o; r++, s++) r in i && Cn(u, s, i[r]);
          else Nr(s + 1), Cn(u, s++, i);
        return (u.length = s), u;
      },
    }
  );
  const yl = { f: dt };
  const ml = Ct.f;
  const bl = (t) => {
    const e = Yn.Symbol || (Yn.Symbol = {});
    ut(e, t) || ml(e, t, { value: yl.f(t) });
  };
  const wl = () => {
    const t = L('Symbol');
    const e = t?.prototype;
    const r = e?.valueOf;
    const n = dt('toPrimitive');
    e &&
      !e[n] &&
      ie(
        e,
        n,
        function (_t) {
          return f(r, this);
        },
        { arity: 1 }
      );
  };
  const Sl = Ar.forEach;
  const El = Xt('hidden');
  const Ol = 'Symbol';
  const xl = 'prototype';
  const Rl = ne.set;
  const Pl = ne.getterFor(Ol);
  const Al = Object[xl];
  let jl = i.Symbol;
  let kl = jl?.[xl];
  const Il = i.RangeError;
  const Tl = i.TypeError;
  const Ml = i.QObject;
  const Ll = Rt.f;
  const Ul = Ct.f;
  const Nl = mo.f;
  const Cl = v.f;
  const _l = b([].push);
  const Fl = nt('symbols');
  const Bl = nt('op-symbols');
  const Dl = nt('wks');
  let zl = !Ml || !Ml[xl] || !Ml[xl].findChild;
  const Wl = (t, e, r) => {
    const n = Ll(Al, e);
    n && delete Al[e], Ul(t, e, r), n && t !== Al && Ul(Al, e, n);
  };
  const ql =
    u &&
    a(
      () =>
        7 !==
        Ve(
          Ul({}, 'a', {
            get: function () {
              return Ul(this, 'a', { value: 7 }).a;
            },
          })
        ).a
    )
      ? Wl
      : Ul;
  const Hl = (t, e) => {
    const r = (Fl[t] = Ve(kl));
    return Rl(r, { type: Ol, tag: t, description: e }), u || (r.description = e), r;
  };
  const $l = (t, e, r) => {
    t === Al && $l(Bl, e, r), kt(t);
    const n = bt(e);
    return (
      kt(r),
      ut(Fl, n)
        ? (r.enumerable
            ? (ut(t, El) && t[El][n] && (t[El][n] = !1), (r = Ve(r, { enumerable: d(0, !1) })))
            : (ut(t, El) || Ul(t, El, d(1, Ve(null))), (t[El][n] = !0)),
          ql(t, n, r))
        : Ul(t, n, r)
    );
  };
  const Kl = (t, e) => {
    kt(t);
    const r = k(e);
    const n = _e(r).concat(Xl(r));
    return (
      Sl(n, (e) => {
        (u && !f(Gl, r, e)) || $l(t, e, r[e]);
      }),
      t
    );
  };
  const Gl = function (t) {
    const e = bt(t);
    const r = f(Cl, this, e);
    return (
      !(this === Al && ut(Fl, e) && !ut(Bl, e)) &&
      (!(r || !ut(this, e) || !ut(Fl, e) || (ut(this, El) && this[El][e])) || r)
    );
  };
  const Vl = (t, e) => {
    const r = k(t);
    const n = bt(e);
    if (r !== Al || !ut(Fl, n) || ut(Bl, n)) {
      const o = Ll(r, n);
      return !o || !ut(Fl, n) || (ut(r, El) && r[El][n]) || (o.enumerable = !0), o;
    }
  };
  const Yl = (t) => {
    const e = Nl(k(t));
    const r = [];
    return (
      Sl(e, (t) => {
        ut(Fl, t) || ut(Jt, t) || _l(r, t);
      }),
      r
    );
  };
  const Xl = (t) => {
    const e = t === Al;
    const r = Nl(e ? Bl : k(t));
    const n = [];
    return (
      Sl(r, (t) => {
        !ut(Fl, t) || (e && !ut(Al, t)) || _l(n, Fl[t]);
      }),
      n
    );
  };
  H ||
    ((jl = function () {
      if (U(kl, this)) throw new Tl('Symbol is not a constructor');
      const t = arguments.length && void 0 !== arguments[0] ? Wr(arguments[0]) : void 0;
      const e = lt(t);
      const r = function (t) {
        const n = void 0 === this ? i : this;
        n === Al && f(r, Bl, t), ut(n, El) && ut(n[El], e) && (n[El][e] = !1);
        const o = d(1, t);
        try {
          ql(n, e, o);
        } catch (t) {
          if (!(t instanceof Il)) throw t;
          Wl(n, e, o);
        }
      };
      return u && zl && ql(Al, e, { configurable: !0, set: r }), Hl(e, t);
    }),
    ie((kl = jl[xl]), 'toString', function () {
      return Pl(this).tag;
    }),
    ie(jl, 'withoutSetter', (t) => Hl(lt(t), t)),
    (v.f = Gl),
    (Ct.f = $l),
    (Be.f = Kl),
    (Rt.f = Vl),
    (Oe.f = mo.f = Yl),
    (xe.f = Xl),
    (yl.f = (t) => Hl(dt(t), t)),
    u &&
      (so(kl, 'description', {
        configurable: !0,
        get: function () {
          return Pl(this).description;
        },
      }),
      ie(Al, 'propertyIsEnumerable', Gl, { unsafe: !0 }))),
    Ce({ global: !0, constructor: !0, wrap: !0, forced: !H, sham: !H }, { Symbol: jl }),
    Sl(_e(Dl), (t) => {
      bl(t);
    }),
    Ce(
      { target: Ol, stat: !0, forced: !H },
      {
        useSetter: () => {
          zl = !0;
        },
        useSimple: () => {
          zl = !1;
        },
      }
    ),
    Ce(
      { target: 'Object', stat: !0, forced: !H, sham: !u },
      {
        create: (t, e) => (void 0 === e ? Ve(t) : Kl(Ve(t), e)),
        defineProperty: $l,
        defineProperties: Kl,
        getOwnPropertyDescriptor: Vl,
      }
    ),
    Ce({ target: 'Object', stat: !0, forced: !H }, { getOwnPropertyNames: Yl }),
    wl(),
    an(jl, Ol),
    (Jt[El] = !0);
  const Jl = H && !!Symbol.for && !!Symbol.keyFor;
  const Ql = nt('string-to-symbol-registry');
  const Zl = nt('symbol-to-string-registry');
  Ce(
    { target: 'Symbol', stat: !0, forced: !Jl },
    {
      for: (t) => {
        const e = Wr(t);
        if (ut(Ql, e)) return Ql[e];
        const r = L('Symbol')(e);
        return (Ql[e] = r), (Zl[r] = e), r;
      },
    }
  );
  const th = nt('symbol-to-string-registry');
  Ce(
    { target: 'Symbol', stat: !0, forced: !Jl },
    {
      keyFor: (t) => {
        if (!G(t)) throw new TypeError(`${Y(t)} is not a symbol`);
        if (ut(th, t)) return th[t];
      },
    }
  );
  const eh = b([].push);
  const rh = String;
  const nh = L('JSON', 'stringify');
  const oh = b(/./.exec);
  const ih = b(''.charAt);
  const ah = b(''.charCodeAt);
  const uh = b(''.replace);
  const sh = b((1).toString);
  const ch = /[\uD800-\uDFFF]/g;
  const fh = /^[\uD800-\uDBFF]$/;
  const lh = /^[\uDC00-\uDFFF]$/;
  const hh =
    !H ||
    a(() => {
      const t = L('Symbol')('stringify detection');
      return '[null]' !== nh([t]) || '{}' !== nh({ a: t }) || '{}' !== nh(Object(t));
    });
  const ph = a(() => '"\\udf06\\ud834"' !== nh('\udf06\ud834') || '"\\udead"' !== nh('\udead'));
  const vh = (t, e) => {
    const r = vo(arguments);
    const n = ((t) => {
      if (T(t)) return t;
      if (ur(t)) {
        for (let e = t.length, r = [], n = 0; n < e; n++) {
          const o = t[n];
          'string' === typeof o
            ? eh(r, o)
            : ('number' !== typeof o && 'Number' !== E(o) && 'String' !== E(o)) || eh(r, Wr(o));
        }
        const i = r.length;
        let a = !0;
        return function (t, e) {
          if (a) return (a = !1), e;
          if (ur(this)) return e;
          for (let n = 0; n < i; n++) if (r[n] === t) return e;
        };
      }
    })(e);
    if (T(n) || (void 0 !== t && !G(t)))
      return (
        (r[1] = function (t, e) {
          if ((T(n) && (e = f(n, this, rh(t), e)), !G(e))) return e;
        }),
        Ra(nh, null, r)
      );
  };
  const dh = (t, e, r) => {
    const n = ih(r, e - 1);
    const o = ih(r, e + 1);
    return (oh(fh, t) && !oh(lh, o)) || (oh(lh, t) && !oh(fh, n)) ? `\\u${sh(ah(t, 0), 16)}` : t;
  };
  nh &&
    Ce(
      { target: 'JSON', stat: !0, arity: 3, forced: hh || ph },
      {
        stringify: (_t, _e, _r) => {
          const n = vo(arguments);
          const o = Ra(hh ? vh : nh, null, n);
          return ph && 'string' === typeof o ? uh(o, ch, dh) : o;
        },
      }
    );
  const gh =
    !H ||
    a(() => {
      xe.f(1);
    });
  Ce(
    { target: 'Object', stat: !0, forced: gh },
    {
      getOwnPropertySymbols: (t) => {
        const e = xe.f;
        return e ? e(it(t)) : [];
      },
    }
  ),
    bl('asyncIterator');
  const yh = i.Symbol;
  const mh = yh?.prototype;
  if (u && T(yh) && (!('description' in mh) || void 0 !== yh().description)) {
    const bh = {};
    const wh = function () {
      const t = arguments.length < 1 || void 0 === arguments[0] ? void 0 : Wr(arguments[0]);
      const e = U(mh, this) ? new yh(t) : void 0 === t ? yh() : yh(t);
      return '' === t && (bh[e] = !0), e;
    };
    Ae(wh, yh), (wh.prototype = mh), (mh.constructor = wh);
    const Sh = 'Symbol(description detection)' === String(yh('description detection'));
    const Eh = b(mh.valueOf);
    const Oh = b(mh.toString);
    const xh = /^Symbol\((.*)\)[^)]+$/;
    const Rh = b(''.replace);
    const Ph = b(''.slice);
    so(mh, 'description', {
      configurable: !0,
      get: function () {
        const t = Eh(this);
        if (ut(bh, t)) return '';
        const e = Oh(t);
        const r = Sh ? Ph(e, 7, -1) : Rh(e, xh, '$1');
        return '' === r ? void 0 : r;
      },
    }),
      Ce({ global: !0, constructor: !0, forced: !0 }, { Symbol: wh });
  }
  bl('hasInstance'),
    bl('isConcatSpreadable'),
    bl('iterator'),
    bl('match'),
    bl('matchAll'),
    bl('replace'),
    bl('search'),
    bl('species'),
    bl('split'),
    bl('toPrimitive'),
    wl(),
    bl('toStringTag'),
    an(L('Symbol'), 'Symbol'),
    bl('unscopables'),
    an(i.JSON, 'JSON', !0),
    an(Math, 'Math', !0);
  const Ah = Ct.f;
  const jh = dt('metadata');
  const kh = Function.prototype;
  void 0 === kh[jh] && Ah(kh, jh, { value: null });
  const Ih = Ct.f;
  const Th = Rt.f;
  const Mh = i.Symbol;
  if ((bl('asyncDispose'), Mh)) {
    const Lh = Th(Mh, 'asyncDispose');
    Lh.enumerable &&
      Lh.configurable &&
      Lh.writable &&
      Ih(Mh, 'asyncDispose', { value: Lh.value, enumerable: !1, configurable: !1, writable: !1 });
  }
  const Uh = Ct.f;
  const Nh = Rt.f;
  const Ch = i.Symbol;
  if ((bl('dispose'), Ch)) {
    const _h = Nh(Ch, 'dispose');
    _h.enumerable &&
      _h.configurable &&
      _h.writable &&
      Uh(Ch, 'dispose', { value: _h.value, enumerable: !1, configurable: !1, writable: !1 });
  }
  bl('metadata');
  const Fh = L('Symbol');
  const Bh = Fh.keyFor;
  const Dh = b(Fh.prototype.valueOf);
  const zh =
    Fh.isRegisteredSymbol ||
    ((t) => {
      try {
        return void 0 !== Bh(Dh(t));
      } catch (_t) {
        return !1;
      }
    });
  Ce({ target: 'Symbol', stat: !0 }, { isRegisteredSymbol: zh });
  for (
    let Wh = L('Symbol'),
      _qh = Wh.isWellKnownSymbol,
      Hh = L('Object', 'getOwnPropertyNames'),
      _$h = b(Wh.prototype.valueOf),
      _Kh = nt('wks'),
      Gh = 0,
      Vh = Hh(Wh),
      Yh = Vh.length;
    Gh < Yh;
    Gh++
  )
    try {
      const Xh = Vh[Gh];
      G(Wh[Xh]) && dt(Xh);
    } catch (_t) {}
  const Jh = (t) => {
    if (qh?.(t)) return !0;
    try {
      for (let e = $h(t), r = 0, n = Hh(Kh), o = n.length; r < o; r++)
        if (Kh[n[r]] === e) return !0;
    } catch (_t) {}
    return !1;
  };
  Ce({ target: 'Symbol', stat: !0, forced: !0 }, { isWellKnownSymbol: Jh }),
    bl('customMatcher'),
    bl('observable'),
    Ce({ target: 'Symbol', stat: !0, name: 'isRegisteredSymbol' }, { isRegistered: zh }),
    Ce({ target: 'Symbol', stat: !0, name: 'isWellKnownSymbol', forced: !0 }, { isWellKnown: Jh }),
    bl('matcher'),
    bl('metadataKey'),
    bl('patternMatch'),
    bl('replaceAll'),
    yl.f('asyncIterator');
  const Qh = Gr.codeAt;
  Ce(
    { target: 'String', proto: !0 },
    {
      codePointAt: function (t) {
        return Qh(this, t);
      },
    }
  ),
    Ze('String', 'codePointAt');
  const Zh = TypeError;
  const tp = (t) => {
    if (es(t)) throw new Zh("The method doesn't accept regular expressions");
    return t;
  };
  const ep = dt('match');
  const rp = (t) => {
    const e = /./;
    try {
      '/./'[t](e);
    } catch (_r) {
      try {
        return (e[ep] = !1), '/./'[t](e);
      } catch (_t) {}
    }
    return !1;
  };
  const np = Rt.f;
  const op = or(''.slice);
  const ip = Math.min;
  const ap = rp('endsWith');
  const up =
    !ap &&
    !!(() => {
      const t = np(String.prototype, 'endsWith');
      return t && !t.writable;
    })();
  Ce(
    { target: 'String', proto: !0, forced: !up && !ap },
    {
      endsWith: function (t) {
        const e = Wr(j(this));
        tp(t);
        const r = arguments.length > 1 ? arguments[1] : void 0;
        const n = e.length;
        const o = void 0 === r ? n : ip(ve(r), n);
        const i = Wr(t);
        return op(e, o - i.length, o) === i;
      },
    }
  ),
    Ze('String', 'endsWith');
  const sp = RangeError;
  const cp = String.fromCharCode;
  const fp = String.fromCodePoint;
  const lp = b([].join);
  Ce(
    { target: 'String', stat: !0, arity: 1, forced: !!fp && 1 !== fp.length },
    {
      fromCodePoint: (_t) => {
        for (let e, r = [], n = arguments.length, o = 0; n > o; ) {
          if (((e = +arguments[o++]), he(e, 1114111) !== e))
            throw new sp(`${e} is not a valid code point`);
          r[o] = e < 65536 ? cp(e) : cp(55296 + ((e -= 65536) >> 10), (e % 1024) + 56320);
        }
        return lp(r, '');
      },
    }
  );
  const hp = b(''.indexOf);
  Ce(
    { target: 'String', proto: !0, forced: !rp('includes') },
    {
      includes: function (t) {
        return !!~hp(Wr(j(this)), Wr(tp(t)), arguments.length > 1 ? arguments[1] : void 0);
      },
    }
  ),
    Ze('String', 'includes'),
    b(un.String);
  const pp = /Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(_);
  const vp = Xc.start;
  Ce(
    { target: 'String', proto: !0, forced: pp },
    {
      padStart: function (t) {
        return vp(this, t, arguments.length > 1 ? arguments[1] : void 0);
      },
    }
  ),
    Ze('String', 'padStart');
  const dp = Xc.end;
  Ce(
    { target: 'String', proto: !0, forced: pp },
    {
      padEnd: function (t) {
        return dp(this, t, arguments.length > 1 ? arguments[1] : void 0);
      },
    }
  ),
    Ze('String', 'padEnd');
  const gp = b([].push);
  const yp = b([].join);
  Ce(
    { target: 'String', stat: !0 },
    {
      raw: (t) => {
        const e = k(it(t).raw);
        const r = de(e);
        if (!r) return '';
        for (let n = arguments.length, o = [], i = 0; ; ) {
          if ((gp(o, Wr(e[i++])), i === r)) return yp(o, '');
          i < n && gp(o, Wr(arguments[i]));
        }
      },
    }
  ),
    Ce({ target: 'String', proto: !0 }, { repeat: $c }),
    Ze('String', 'repeat');
  const mp = Rt.f;
  const bp = or(''.slice);
  const wp = Math.min;
  const Sp = rp('startsWith');
  const Ep =
    !Sp &&
    !!(() => {
      const t = mp(String.prototype, 'startsWith');
      return t && !t.writable;
    })();
  Ce(
    { target: 'String', proto: !0, forced: !Ep && !Sp },
    {
      startsWith: function (t) {
        const e = Wr(j(this));
        tp(t);
        const r = ve(wp(arguments.length > 1 ? arguments[1] : void 0, e.length));
        const n = Wr(t);
        return bp(e, r, r + n.length) === n;
      },
    }
  ),
    Ze('String', 'startsWith');
  const Op = zt.PROPER;
  const xp = (t) => a(() => !!Mi[t]() || '​᠎' !== '​᠎'[t]() || (Op && Mi[t].name !== t));
  const Rp = _i.start;
  const Pp = xp('trimStart')
    ? function () {
        return Rp(this);
      }
    : ''.trimStart;
  Ce(
    { target: 'String', proto: !0, name: 'trimStart', forced: ''.trimLeft !== Pp },
    { trimLeft: Pp }
  ),
    Ce(
      { target: 'String', proto: !0, name: 'trimStart', forced: ''.trimStart !== Pp },
      { trimStart: Pp }
    ),
    Ze('String', 'trimLeft');
  const Ap = _i.end;
  const jp = xp('trimEnd')
    ? function () {
        return Ap(this);
      }
    : ''.trimEnd;
  Ce(
    { target: 'String', proto: !0, name: 'trimEnd', forced: ''.trimRight !== jp },
    { trimRight: jp }
  ),
    Ce(
      { target: 'String', proto: !0, name: 'trimEnd', forced: ''.trimEnd !== jp },
      { trimEnd: jp }
    ),
    Ze('String', 'trimRight');
  const kp = Object.getOwnPropertyDescriptor;
  const Ip = (t) => {
    if (!u) return i[t];
    const e = kp(i, t);
    return e?.value;
  };
  const Tp = dt('iterator');
  const Mp = !a(() => {
    const t = new URL('b?a=1&b=2&c=3', 'https://a');
    const e = t.searchParams;
    const r = new URLSearchParams('a=1&a=2&b=3');
    let n = '';
    return (
      (t.pathname = 'c%20d'),
      e.forEach((t, r) => {
        e.delete('b'), (n += r + t);
      }),
      r.delete('a', 2),
      r.delete('b', void 0),
      (!e.size && !u) ||
        !e.sort ||
        'https://a/c%20d?a=1&c=3' !== t.href ||
        '3' !== e.get('c') ||
        'a=1' !== String(new URLSearchParams('?a=1')) ||
        !e[Tp] ||
        'a' !== new URL('https://a@b').username ||
        'b' !== new URLSearchParams(new URLSearchParams('a=b')).get('a') ||
        'xn--e1aybc' !== new URL('https://тест').host ||
        '#%D0%B1' !== new URL('https://a#б').hash ||
        'a1c3' !== n ||
        'x' !== new URL('https://x', void 0).host
    );
  });
  const Lp = TypeError;
  const Up = (t, e) => {
    if (t < e) throw new Lp('Not enough arguments');
    return t;
  };
  const Np = Math.floor;
  const Cp = (t, e) => {
    const r = t.length;
    if (r < 8)
      for (let n, o, i = 1; i < r; ) {
        for (o = i, n = t[i]; o && e(t[o - 1], n) > 0; ) t[o] = t[--o];
        o !== i++ && (t[o] = n);
      }
    else
      for (
        let a = Np(r / 2),
          u = Cp(vo(t, 0, a), e),
          s = Cp(vo(t, a), e),
          c = u.length,
          f = s.length,
          l = 0,
          h = 0;
        l < c || h < f;
      )
        t[l + h] =
          l < c && h < f ? (e(u[l], s[h]) <= 0 ? u[l++] : s[h++]) : l < c ? u[l++] : s[h++];
    return t;
  };
  const _p = Cp;
  const Fp = dt('iterator');
  const Bp = 'URLSearchParams';
  const Dp = `${Bp}Iterator`;
  const zp = ne.set;
  const Wp = ne.getterFor(Bp);
  const qp = ne.getterFor(Dp);
  const Hp = Ip('fetch');
  const $p = Ip('Request');
  const Kp = Ip('Headers');
  const Gp = $p?.prototype;
  const Vp = Kp?.prototype;
  const Yp = i.TypeError;
  const Xp = i.encodeURIComponent;
  const Jp = String.fromCharCode;
  const Qp = L('String', 'fromCodePoint');
  const Zp = Number.parseInt;
  const tv = b(''.charAt);
  const ev = b([].join);
  const rv = b([].push);
  const nv = b(''.replace);
  const ov = b([].shift);
  const iv = b([].splice);
  const av = b(''.split);
  const uv = b(''.slice);
  const sv = b(/./.exec);
  const cv = /\+/g;
  const fv = /^[0-9a-f]+$/i;
  const lv = (t, e) => {
    const r = uv(t, e, e + 2);
    return sv(fv, r) ? Zp(r, 16) : Number.NaN;
  };
  const hv = (t) => {
    for (let e = 0, r = 128; r > 0 && 0 !== (t & r); r >>= 1) e++;
    return e;
  };
  const pv = (t) => {
    let e = null;
    switch (t.length) {
      case 1:
        e = t[0];
        break;
      case 2:
        e = ((31 & t[0]) << 6) | (63 & t[1]);
        break;
      case 3:
        e = ((15 & t[0]) << 12) | ((63 & t[1]) << 6) | (63 & t[2]);
        break;
      case 4:
        e = ((7 & t[0]) << 18) | ((63 & t[1]) << 12) | ((63 & t[2]) << 6) | (63 & t[3]);
    }
    return e > 1114111 ? null : e;
  };
  const vv = (t) => {
    for (let e = (t = nv(t, cv, ' ')).length, r = '', n = 0; n < e; ) {
      let o = tv(t, n);
      if ('%' === o) {
        if ('%' === tv(t, n + 1) || n + 3 > e) {
          (r += '%'), n++;
          continue;
        }
        const i = lv(t, n + 1);
        if (i !== i) {
          (r += o), n++;
          continue;
        }
        n += 2;
        const a = hv(i);
        if (0 === a) o = Jp(i);
        else {
          if (1 === a || a > 4) {
            (r += '�'), n++;
            continue;
          }
          for (let u = [i], s = 1; s < a && !(3 + ++n > e || '%' !== tv(t, n)); ) {
            const c = lv(t, n + 1);
            if (c !== c) {
              n += 3;
              break;
            }
            if (c > 191 || c < 128) break;
            rv(u, c), (n += 2), s++;
          }
          if (u.length !== a) {
            r += '�';
            continue;
          }
          const f = pv(u);
          null === f ? (r += '�') : (o = Qp(f));
        }
      }
      (r += o), n++;
    }
    return r;
  };
  const dv = /[!'()~]|%20/g;
  const gv = { '!': '%21', "'": '%27', '(': '%28', ')': '%29', '~': '%7E', '%20': '+' };
  const yv = (t) => gv[t];
  const mv = (t) => nv(Xp(t), dv, yv);
  const bv = fn(
    function (t, e) {
      zp(this, { type: Dp, target: Wp(t).entries, index: 0, kind: e });
    },
    Bp,
    function () {
      const t = qp(this);
      const e = t.target;
      const r = t.index++;
      if (!e || r >= e.length) return (t.target = null), Pn(void 0, !0);
      const n = e[r];
      switch (t.kind) {
        case 'keys':
          return Pn(n.key, !1);
        case 'values':
          return Pn(n.value, !1);
      }
      return Pn([n.key, n.value], !1);
    },
    !0
  );
  const wv = function (t) {
    (this.entries = []),
      (this.url = null),
      void 0 !== t &&
        (M(t)
          ? this.parseObject(t)
          : this.parseQuery('string' === typeof t ? ('?' === tv(t, 0) ? uv(t, 1) : t) : Wr(t)));
  };
  wv.prototype = {
    type: Bp,
    bindURL: function (t) {
      (this.url = t), this.update();
    },
    parseObject: function (t) {
      let e;
      let r;
      let n;
      let o;
      let i;
      let a;
      let u;
      const s = this.entries;
      const c = Fn(t);
      if (c)
        for (r = (e = Dn(t, c)).next; !(n = f(r, e)).done; ) {
          if (
            ((o = Dn(kt(n.value))),
            (a = f((i = o.next), o)).done || (u = f(i, o)).done || !f(i, o).done)
          )
            throw new Yp('Expected sequence with length 2');
          rv(s, { key: Wr(a.value), value: Wr(u.value) });
        }
      else for (const l in t) ut(t, l) && rv(s, { key: l, value: Wr(t[l]) });
    },
    parseQuery: function (t) {
      if (t)
        for (let e, r, n = this.entries, o = av(t, '&'), i = 0; i < o.length; )
          (e = o[i++]).length &&
            ((r = av(e, '=')), rv(n, { key: vv(ov(r)), value: vv(ev(r, '=')) }));
    },
    serialize: function () {
      for (let t, e = this.entries, r = [], n = 0; n < e.length; )
        (t = e[n++]), rv(r, `${mv(t.key)}=${mv(t.value)}`);
      return ev(r, '&');
    },
    update: function () {
      (this.entries.length = 0), this.parseQuery(this.url.query);
    },
    updateURL: function () {
      this.url?.update();
    },
  };
  const Sv = function () {
    ko(this, Ev);
    const t = zp(this, new wv(arguments.length > 0 ? arguments[0] : void 0));
    u || (this.size = t.entries.length);
  };
  const Ev = Sv.prototype;
  if (
    (Mo(
      Ev,
      {
        append: function (t, e) {
          const r = Wp(this);
          Up(arguments.length, 2),
            rv(r.entries, { key: Wr(t), value: Wr(e) }),
            u || this.length++,
            r.updateURL();
        },
        delete: function (t) {
          for (
            let e = Wp(this),
              r = Up(arguments.length, 1),
              n = e.entries,
              o = Wr(t),
              i = r < 2 ? void 0 : arguments[1],
              a = void 0 === i ? i : Wr(i),
              s = 0;
            s < n.length;
          ) {
            const c = n[s];
            if (c.key !== o || (void 0 !== a && c.value !== a)) s++;
            else if ((iv(n, s, 1), void 0 !== a)) break;
          }
          u || (this.size = n.length), e.updateURL();
        },
        get: function (t) {
          const e = Wp(this).entries;
          Up(arguments.length, 1);
          for (let r = Wr(t), n = 0; n < e.length; n++) if (e[n].key === r) return e[n].value;
          return null;
        },
        getAll: function (t) {
          const e = Wp(this).entries;
          Up(arguments.length, 1);
          for (let r = Wr(t), n = [], o = 0; o < e.length; o++) e[o].key === r && rv(n, e[o].value);
          return n;
        },
        has: function (t) {
          for (
            let e = Wp(this).entries,
              r = Up(arguments.length, 1),
              n = Wr(t),
              o = r < 2 ? void 0 : arguments[1],
              i = void 0 === o ? o : Wr(o),
              a = 0;
            a < e.length;
          ) {
            const u = e[a++];
            if (u.key === n && (void 0 === i || u.value === i)) return !0;
          }
          return !1;
        },
        set: function (t, e) {
          const r = Wp(this);
          Up(arguments.length, 1);
          for (let n, o = r.entries, i = !1, a = Wr(t), s = Wr(e), c = 0; c < o.length; c++)
            (n = o[c]).key === a && (i ? iv(o, c--, 1) : ((i = !0), (n.value = s)));
          i || rv(o, { key: a, value: s }), u || (this.size = o.length), r.updateURL();
        },
        sort: function () {
          const t = Wp(this);
          _p(t.entries, (t, e) => (t.key > e.key ? 1 : -1)), t.updateURL();
        },
        forEach: function (t) {
          for (
            let e,
              r = Wp(this).entries,
              n = ar(t, arguments.length > 1 ? arguments[1] : void 0),
              o = 0;
            o < r.length;
          )
            n((e = r[o++]).value, e.key, this);
        },
        keys: function () {
          return new bv(this, 'keys');
        },
        values: function () {
          return new bv(this, 'values');
        },
        entries: function () {
          return new bv(this, 'entries');
        },
      },
      { enumerable: !0 }
    ),
    ie(Ev, Fp, Ev.entries, { name: 'entries' }),
    ie(
      Ev,
      'toString',
      function () {
        return Wp(this).serialize();
      },
      { enumerable: !0 }
    ),
    u &&
      so(Ev, 'size', {
        get: function () {
          return Wp(this).entries.length;
        },
        configurable: !0,
        enumerable: !0,
      }),
    an(Sv, Bp),
    Ce({ global: !0, constructor: !0, forced: !Mp }, { URLSearchParams: Sv }),
    !Mp && T(Kp))
  ) {
    const Ov = b(Vp.has);
    const xv = b(Vp.set);
    const Rv = (t) => {
      if (M(t)) {
        let e;
        const r = t.body;
        if (pr(r) === Bp)
          return (
            (e = t.headers ? new Kp(t.headers) : new Kp()),
            Ov(e, 'content-type') ||
              xv(e, 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8'),
            Ve(t, { body: d(0, Wr(r)), headers: d(0, e) })
          );
      }
      return t;
    };
    if (
      (T(Hp) &&
        Ce(
          { global: !0, enumerable: !0, dontCallGetSet: !0, forced: !0 },
          { fetch: (t) => Hp(t, arguments.length > 1 ? Rv(arguments[1]) : {}) }
        ),
      T($p))
    ) {
      const Pv = function (t) {
        return ko(this, Gp), new $p(t, arguments.length > 1 ? Rv(arguments[1]) : {});
      };
      (Gp.constructor = Pv),
        (Pv.prototype = Gp),
        Ce({ global: !0, constructor: !0, dontCallGetSet: !0, forced: !0 }, { Request: Pv });
    }
  }
  const Av = { URLSearchParams: Sv, getState: Wp };
  const jv = URLSearchParams;
  const kv = jv.prototype;
  const Iv = b(kv.append);
  const Tv = b(kv.delete);
  const Mv = b(kv.forEach);
  const Lv = b([].push);
  const Uv = new jv('a=1&a=2&b=3');
  Uv.delete('a', 1),
    Uv.delete('b', void 0),
    `${Uv}` !== 'a=2' &&
      ie(
        kv,
        'delete',
        function (t) {
          const e = arguments.length;
          const r = e < 2 ? void 0 : arguments[1];
          if (e && void 0 === r) return Tv(this, t);
          const n = [];
          Mv(this, (t, e) => {
            Lv(n, { key: e, value: t });
          }),
            Up(e, 1);
          for (let o, i = Wr(t), _a = Wr(r), u = 0, s = 0, c = !1, f = n.length; u < f; )
            (o = n[u++]), c || o.key === i ? ((c = !0), Tv(this, o.key)) : s++;
          while (s < f) ((o = n[s++]).key === i && o.value === a) || Iv(this, o.key, o.value);
        },
        { enumerable: !0, unsafe: !0 }
      );
  const Nv = URLSearchParams;
  const Cv = Nv.prototype;
  const _v = b(Cv.getAll);
  const Fv = b(Cv.has);
  const Bv = new Nv('a=1');
  (!Bv.has('a', 2) && Bv.has('a', void 0)) ||
    ie(
      Cv,
      'has',
      function (t) {
        const e = arguments.length;
        const r = e < 2 ? void 0 : arguments[1];
        if (e && void 0 === r) return Fv(this, t);
        const n = _v(this, t);
        Up(e, 1);
        for (let o = Wr(r), i = 0; i < n.length; ) if (n[i++] === o) return !0;
        return !1;
      },
      { enumerable: !0, unsafe: !0 }
    );
  const Dv = URLSearchParams.prototype;
  const zv = b(Dv.forEach);
  u &&
    !('size' in Dv) &&
    so(Dv, 'size', {
      get: function () {
        let t = 0;
        return (
          zv(this, () => {
            t++;
          }),
          t
        );
      },
      configurable: !0,
      enumerable: !0,
    });
  let Wv;
  const qv = Object.assign;
  const Hv = Object.defineProperty;
  const $v = b([].concat);
  const Kv =
    !qv ||
    a(() => {
      if (
        u &&
        1 !==
          qv(
            { b: 1 },
            qv(
              Hv({}, 'a', {
                enumerable: !0,
                get: function () {
                  Hv(this, 'b', { value: 3, enumerable: !1 });
                },
              }),
              { b: 2 }
            )
          ).b
      )
        return !0;
      const t = {};
      const e = {};
      const r = Symbol('assign detection');
      const n = 'abcdefghijklmnopqrst';
      return (
        (t[r] = 7),
        n.split('').forEach((t) => {
          e[t] = t;
        }),
        7 !== qv({}, t)[r] || _e(qv({}, e)).join('') !== n
      );
    })
      ? (t, _e) => {
          for (let r = it(t), n = arguments.length, o = 1, i = xe.f, a = v.f; n > o; )
            for (
              let s, c = R(arguments[o++]), l = i ? $v(_e(c), i(c)) : _e(c), h = l.length, p = 0;
              h > p;
            )
              (s = l[p++]), (u && !f(a, c, s)) || (r[s] = c[s]);
          return r;
        }
      : qv;
  const Gv = 2147483647;
  const Vv = /[^\0-\u007E]/;
  const Yv = /[.\u3002\uFF0E\uFF61]/g;
  const Xv = 'Overflow: input needs wider integers to process';
  const Jv = RangeError;
  const Qv = b(Yv.exec);
  const Zv = Math.floor;
  const td = String.fromCharCode;
  const ed = b(''.charCodeAt);
  const rd = b([].join);
  const nd = b([].push);
  const od = b(''.replace);
  const id = b(''.split);
  const ad = b(''.toLowerCase);
  const ud = (t) => t + 22 + 75 * (t < 26);
  const sd = (t, e, r) => {
    let n = 0;
    for (t = r ? Zv(t / 700) : t >> 1, t += Zv(t / e); t > 455; ) (t = Zv(t / 35)), (n += 36);
    return Zv(n + (36 * t) / (t + 38));
  };
  const cd = (t) => {
    const e = [];
    t = ((t) => {
      for (let e = [], r = 0, n = t.length; r < n; ) {
        const o = ed(t, r++);
        if (o >= 55296 && o <= 56319 && r < n) {
          const i = ed(t, r++);
          56320 === (64512 & i) ? nd(e, ((1023 & o) << 10) + (1023 & i) + 65536) : (nd(e, o), r--);
        } else nd(e, o);
      }
      return e;
    })(t);
    let r;
    let n;
    const o = t.length;
    let i = 128;
    let a = 0;
    let u = 72;
    for (r = 0; r < t.length; r++) (n = t[r]) < 128 && nd(e, td(n));
    const s = e.length;
    let c = s;
    for (s && nd(e, '-'); c < o; ) {
      let f = Gv;
      for (r = 0; r < t.length; r++) (n = t[r]) >= i && n < f && (f = n);
      const l = c + 1;
      if (f - i > Zv((Gv - a) / l)) throw new Jv(Xv);
      for (a += (f - i) * l, i = f, r = 0; r < t.length; r++) {
        if ((n = t[r]) < i && ++a > Gv) throw new Jv(Xv);
        if (n === i) {
          for (let h = a, p = 36; ; ) {
            const v = p <= u ? 1 : p >= u + 26 ? 26 : p - u;
            if (h < v) break;
            const d = h - v;
            const g = 36 - v;
            nd(e, td(ud(v + (d % g)))), (h = Zv(d / g)), (p += 36);
          }
          nd(e, td(ud(h))), (u = sd(a, l, c === s)), (a = 0), c++;
        }
      }
      a++, i++;
    }
    return rd(e, '');
  };
  const fd = Gr.codeAt;
  const ld = ne.set;
  const hd = ne.getterFor('URL');
  const pd = Av.URLSearchParams;
  const vd = Av.getState;
  const dd = i.URL;
  const gd = i.TypeError;
  const yd = i.parseInt;
  const md = Math.floor;
  const bd = Math.pow;
  const wd = b(''.charAt);
  const Sd = b(/./.exec);
  const Ed = b([].join);
  const Od = b((1).toString);
  const xd = b([].pop);
  const Rd = b([].push);
  const Pd = b(''.replace);
  const Ad = b([].shift);
  const jd = b(''.split);
  const kd = b(''.slice);
  const Id = b(''.toLowerCase);
  const Td = b([].unshift);
  const Md = 'Invalid scheme';
  const Ld = 'Invalid host';
  const Ud = 'Invalid port';
  const Nd = /[a-z]/i;
  const Cd = /[\d+-.a-z]/i;
  const _d = /\d/;
  const Fd = /^0x/i;
  const Bd = /^[0-7]+$/;
  const Dd = /^\d+$/;
  const zd = /^[\da-f]+$/i;
  const Wd = /[\0\t\n\r #%/:<>?@[\\\]^|]/;
  const qd = /[\0\t\n\r #/:<>?@[\\\]^|]/;
  const Hd = /^[\u0000-\u0020]+/;
  const $d = /(^|[^\u0000-\u0020])[\u0000-\u0020]+$/;
  const Kd = /[\t\n\r]/g;
  const Gd = (t) => {
    let e;
    let r;
    let n;
    let o;
    if ('number' === typeof t) {
      for (e = [], r = 0; r < 4; r++) Td(e, t % 256), (t = md(t / 256));
      return Ed(e, '.');
    }
    if ('object' === typeof t) {
      for (
        e = '',
          n = ((t) => {
            for (let e = null, r = 1, n = null, o = 0, i = 0; i < 8; i++)
              0 !== t[i]
                ? (o > r && ((e = n), (r = o)), (n = null), (o = 0))
                : (null === n && (n = i), ++o);
            return o > r ? n : e;
          })(t),
          r = 0;
        r < 8;
        r++
      )
        (o && 0 === t[r]) ||
          (o && (o = !1),
          n === r ? ((e += r ? ':' : '::'), (o = !0)) : ((e += Od(t[r], 16)), r < 7 && (e += ':')));
      return `[${e}]`;
    }
    return t;
  };
  const Vd = {};
  const Yd = Kv({}, Vd, { ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1 });
  const Xd = Kv({}, Yd, { '#': 1, '?': 1, '{': 1, '}': 1 });
  const Jd = Kv({}, Xd, {
    '/': 1,
    ':': 1,
    ';': 1,
    '=': 1,
    '@': 1,
    '[': 1,
    '\\': 1,
    ']': 1,
    '^': 1,
    '|': 1,
  });
  const Qd = (t, e) => {
    const r = fd(t, 0);
    return r > 32 && r < 127 && !ut(e, t) ? t : encodeURIComponent(t);
  };
  const Zd = { ftp: 21, file: null, http: 80, https: 443, ws: 80, wss: 443 };
  const tg = (t, e) => {
    let r;
    return 2 === t.length && Sd(Nd, wd(t, 0)) && (':' === (r = wd(t, 1)) || (!e && '|' === r));
  };
  const eg = (t) => {
    let e;
    return (
      t.length > 1 &&
      tg(kd(t, 0, 2)) &&
      (2 === t.length || '/' === (e = wd(t, 2)) || '\\' === e || '?' === e || '#' === e)
    );
  };
  const rg = (t) => '.' === t || '%2e' === Id(t);
  const ng = {};
  const og = {};
  const ig = {};
  const ag = {};
  const ug = {};
  const sg = {};
  const cg = {};
  const fg = {};
  const lg = {};
  const hg = {};
  const pg = {};
  const vg = {};
  const dg = {};
  const gg = {};
  const yg = {};
  const mg = {};
  const bg = {};
  const wg = {};
  const Sg = {};
  const Eg = {};
  const Og = {};
  const xg = function (t, e, r) {
    let n;
    let o;
    let i;
    const a = Wr(t);
    if (e) {
      if ((o = this.parse(a))) throw new gd(o);
      this.searchParams = null;
    } else {
      if ((void 0 !== r && (n = new xg(r, !0)), (o = this.parse(a, null, n)))) throw new gd(o);
      (i = vd(new pd())).bindURL(this), (this.searchParams = i);
    }
  };
  xg.prototype = {
    type: 'URL',
    parse: function (t, e, r) {
      let n;
      let o;
      let i;
      let a;
      let u;
      let c = e || ng;
      let f = 0;
      let l = '';
      let h = !1;
      let p = !1;
      let v = !1;
      for (
        t = Wr(t),
          e ||
            ((this.scheme = ''),
            (this.username = ''),
            (this.password = ''),
            (this.host = null),
            (this.port = null),
            (this.path = []),
            (this.query = null),
            (this.fragment = null),
            (this.cannotBeABaseURL = !1),
            (t = Pd(t, Hd, '')),
            (t = Pd(t, $d, '$1'))),
          t = Pd(t, Kd, ''),
          n = Wn(t);
        f <= n.length;
      ) {
        switch (((o = n[f]), c)) {
          case ng:
            if (!o || !Sd(Nd, o)) {
              if (e) return Md;
              c = ig;
              continue;
            }
            (l += Id(o)), (c = og);
            break;
          case og:
            if (o && (Sd(Cd, o) || '+' === o || '-' === o || '.' === o)) l += Id(o);
            else {
              if (':' !== o) {
                if (e) return Md;
                (l = ''), (c = ig), (f = 0);
                continue;
              }
              if (
                e &&
                (this.isSpecial() !== ut(Zd, l) ||
                  ('file' === l && (this.includesCredentials() || null !== this.port)) ||
                  ('file' === this.scheme && !this.host))
              )
                return;
              if (((this.scheme = l), e))
                return void (
                  this.isSpecial() &&
                  Zd[this.scheme] === this.port &&
                  (this.port = null)
                );
              (l = ''),
                'file' === this.scheme
                  ? (c = gg)
                  : this.isSpecial() && r && r.scheme === this.scheme
                    ? (c = ag)
                    : this.isSpecial()
                      ? (c = fg)
                      : '/' === n[f + 1]
                        ? ((c = ug), f++)
                        : ((this.cannotBeABaseURL = !0), Rd(this.path, ''), (c = Sg));
            }
            break;
          case ig:
            if (!r || (r.cannotBeABaseURL && '#' !== o)) return Md;
            if (r.cannotBeABaseURL && '#' === o) {
              (this.scheme = r.scheme),
                (this.path = vo(r.path)),
                (this.query = r.query),
                (this.fragment = ''),
                (this.cannotBeABaseURL = !0),
                (c = Og);
              break;
            }
            c = 'file' === r.scheme ? gg : sg;
            continue;
          case ag:
            if ('/' !== o || '/' !== n[f + 1]) {
              c = sg;
              continue;
            }
            (c = lg), f++;
            break;
          case ug:
            if ('/' === o) {
              c = hg;
              break;
            }
            c = wg;
            continue;
          case sg:
            if (((this.scheme = r.scheme), o === Wv))
              (this.username = r.username),
                (this.password = r.password),
                (this.host = r.host),
                (this.port = r.port),
                (this.path = vo(r.path)),
                (this.query = r.query);
            else if ('/' === o || ('\\' === o && this.isSpecial())) c = cg;
            else if ('?' === o)
              (this.username = r.username),
                (this.password = r.password),
                (this.host = r.host),
                (this.port = r.port),
                (this.path = vo(r.path)),
                (this.query = ''),
                (c = Eg);
            else {
              if ('#' !== o) {
                (this.username = r.username),
                  (this.password = r.password),
                  (this.host = r.host),
                  (this.port = r.port),
                  (this.path = vo(r.path)),
                  this.path.length--,
                  (c = wg);
                continue;
              }
              (this.username = r.username),
                (this.password = r.password),
                (this.host = r.host),
                (this.port = r.port),
                (this.path = vo(r.path)),
                (this.query = r.query),
                (this.fragment = ''),
                (c = Og);
            }
            break;
          case cg:
            if (!this.isSpecial() || ('/' !== o && '\\' !== o)) {
              if ('/' !== o) {
                (this.username = r.username),
                  (this.password = r.password),
                  (this.host = r.host),
                  (this.port = r.port),
                  (c = wg);
                continue;
              }
              c = hg;
            } else c = lg;
            break;
          case fg:
            if (((c = lg), '/' !== o || '/' !== wd(l, f + 1))) continue;
            f++;
            break;
          case lg:
            if ('/' !== o && '\\' !== o) {
              c = hg;
              continue;
            }
            break;
          case hg:
            if ('@' === o) {
              h && (l = `%40${l}`), (h = !0), (i = Wn(l));
              for (let d = 0; d < i.length; d++) {
                const g = i[d];
                if (':' !== g || v) {
                  const y = Qd(g, Jd);
                  v ? (this.password += y) : (this.username += y);
                } else v = !0;
              }
              l = '';
            } else if (
              o === Wv ||
              '/' === o ||
              '?' === o ||
              '#' === o ||
              ('\\' === o && this.isSpecial())
            ) {
              if (h && '' === l) return 'Invalid authority';
              (f -= Wn(l).length + 1), (l = ''), (c = pg);
            } else l += o;
            break;
          case pg:
          case vg:
            if (e && 'file' === this.scheme) {
              c = mg;
              continue;
            }
            if (':' !== o || p) {
              if (
                o === Wv ||
                '/' === o ||
                '?' === o ||
                '#' === o ||
                ('\\' === o && this.isSpecial())
              ) {
                if (this.isSpecial() && '' === l) return Ld;
                if (e && '' === l && (this.includesCredentials() || null !== this.port)) return;
                if ((a = this.parseHost(l))) return a;
                if (((l = ''), (c = bg), e)) return;
                continue;
              }
              '[' === o ? (p = !0) : ']' === o && (p = !1), (l += o);
            } else {
              if ('' === l) return Ld;
              if ((a = this.parseHost(l))) return a;
              if (((l = ''), (c = dg), e === vg)) return;
            }
            break;
          case dg:
            if (!Sd(_d, o)) {
              if (
                o === Wv ||
                '/' === o ||
                '?' === o ||
                '#' === o ||
                ('\\' === o && this.isSpecial()) ||
                e
              ) {
                if ('' !== l) {
                  const m = yd(l, 10);
                  if (m > 65535) return Ud;
                  (this.port = this.isSpecial() && m === Zd[this.scheme] ? null : m), (l = '');
                }
                if (e) return;
                c = bg;
                continue;
              }
              return Ud;
            }
            l += o;
            break;
          case gg:
            if (((this.scheme = 'file'), '/' === o || '\\' === o)) c = yg;
            else {
              if (!r || 'file' !== r.scheme) {
                c = wg;
                continue;
              }
              switch (o) {
                case Wv:
                  (this.host = r.host), (this.path = vo(r.path)), (this.query = r.query);
                  break;
                case '?':
                  (this.host = r.host), (this.path = vo(r.path)), (this.query = ''), (c = Eg);
                  break;
                case '#':
                  (this.host = r.host),
                    (this.path = vo(r.path)),
                    (this.query = r.query),
                    (this.fragment = ''),
                    (c = Og);
                  break;
                default:
                  eg(Ed(vo(n, f), '')) ||
                    ((this.host = r.host), (this.path = vo(r.path)), this.shortenPath()),
                    (c = wg);
                  continue;
              }
            }
            break;
          case yg:
            if ('/' === o || '\\' === o) {
              c = mg;
              break;
            }
            r &&
              'file' === r.scheme &&
              !eg(Ed(vo(n, f), '')) &&
              (tg(r.path[0], !0) ? Rd(this.path, r.path[0]) : (this.host = r.host)),
              (c = wg);
            continue;
          case mg:
            if (o === Wv || '/' === o || '\\' === o || '?' === o || '#' === o) {
              if (!e && tg(l)) c = wg;
              else if ('' === l) {
                if (((this.host = ''), e)) return;
                c = bg;
              } else {
                if ((a = this.parseHost(l))) return a;
                if (('localhost' === this.host && (this.host = ''), e)) return;
                (l = ''), (c = bg);
              }
              continue;
            }
            l += o;
            break;
          case bg:
            if (this.isSpecial()) {
              if (((c = wg), '/' !== o && '\\' !== o)) continue;
            } else if (e || '?' !== o)
              if (e || '#' !== o) {
                if (o !== Wv && ((c = wg), '/' !== o)) continue;
              } else (this.fragment = ''), (c = Og);
            else (this.query = ''), (c = Eg);
            break;
          case wg:
            if (
              o === Wv ||
              '/' === o ||
              ('\\' === o && this.isSpecial()) ||
              (!e && ('?' === o || '#' === o))
            ) {
              if (
                ('..' === (u = Id((u = l))) || '%2e.' === u || '.%2e' === u || '%2e%2e' === u
                  ? (this.shortenPath(),
                    '/' === o || ('\\' === o && this.isSpecial()) || Rd(this.path, ''))
                  : rg(l)
                    ? '/' === o || ('\\' === o && this.isSpecial()) || Rd(this.path, '')
                    : ('file' === this.scheme &&
                        !this.path.length &&
                        tg(l) &&
                        (this.host && (this.host = ''), (l = `${wd(l, 0)}:`)),
                      Rd(this.path, l)),
                (l = ''),
                'file' === this.scheme && (o === Wv || '?' === o || '#' === o))
              )
                while (this.path.length > 1 && '' === this.path[0]) Ad(this.path);
              '?' === o
                ? ((this.query = ''), (c = Eg))
                : '#' === o && ((this.fragment = ''), (c = Og));
            } else l += Qd(o, Xd);
            break;
          case Sg:
            '?' === o
              ? ((this.query = ''), (c = Eg))
              : '#' === o
                ? ((this.fragment = ''), (c = Og))
                : o !== Wv && (this.path[0] += Qd(o, Vd));
            break;
          case Eg:
            e || '#' !== o
              ? o !== Wv &&
                ("'" === o && this.isSpecial()
                  ? (this.query += '%27')
                  : (this.query += '#' === o ? '%23' : Qd(o, Vd)))
              : ((this.fragment = ''), (c = Og));
            break;
          case Og:
            o !== Wv && (this.fragment += Qd(o, Yd));
        }
        f++;
      }
    },
    parseHost: function (t) {
      let e;
      let r;
      let n;
      if ('[' === wd(t, 0)) {
        if (']' !== wd(t, t.length - 1)) return Ld;
        if (
          ((e = ((t) => {
            let e;
            let r;
            let n;
            let o;
            let i;
            let a;
            let u;
            const s = [0, 0, 0, 0, 0, 0, 0, 0];
            let c = 0;
            let f = null;
            let l = 0;
            const h = () => wd(t, l);
            if (':' === h()) {
              if (':' !== wd(t, 1)) return;
              (l += 2), (f = ++c);
            }
            while (h()) {
              if (8 === c) return;
              if (':' !== h()) {
                for (e = r = 0; r < 4 && Sd(zd, h()); ) (e = 16 * e + yd(h(), 16)), l++, r++;
                if ('.' === h()) {
                  if (0 === r) return;
                  if (((l -= r), c > 6)) return;
                  for (n = 0; h(); ) {
                    if (((o = null), n > 0)) {
                      if (!('.' === h() && n < 4)) return;
                      l++;
                    }
                    if (!Sd(_d, h())) return;
                    while (Sd(_d, h())) {
                      if (((i = yd(h(), 10)), null === o)) o = i;
                      else {
                        if (0 === o) return;
                        o = 10 * o + i;
                      }
                      if (o > 255) return;
                      l++;
                    }
                    (s[c] = 256 * s[c] + o), (2 !== ++n && 4 !== n) || c++;
                  }
                  if (4 !== n) return;
                  break;
                }
                if (':' === h()) {
                  if ((l++, !h())) return;
                } else if (h()) return;
                s[c++] = e;
              } else {
                if (null !== f) return;
                l++, (f = ++c);
              }
            }
            if (null !== f)
              for (a = c - f, c = 7; 0 !== c && a > 0; )
                (u = s[c]), (s[c--] = s[f + a - 1]), (s[f + --a] = u);
            else if (8 !== c) return;
            return s;
          })(kd(t, 1, -1))),
          !e)
        )
          return Ld;
        this.host = e;
      } else if (this.isSpecial()) {
        if (
          ((t = ((t) => {
            let e;
            let r;
            const n = [];
            const o = id(od(ad(t), Yv, '.'), '.');
            for (e = 0; e < o.length; e++) nd(n, Qv(Vv, (r = o[e])) ? `xn--${cd(r)}` : r);
            return rd(n, '.');
          })(t)),
          Sd(Wd, t))
        )
          return Ld;
        if (
          ((e = ((t) => {
            let e;
            let r;
            let n;
            let o;
            let i;
            let a;
            let u;
            const s = jd(t, '.');
            if ((s.length && '' === s[s.length - 1] && s.length--, (e = s.length) > 4)) return t;
            for (r = [], n = 0; n < e; n++) {
              if ('' === (o = s[n])) return t;
              if (
                ((i = 10),
                o.length > 1 &&
                  '0' === wd(o, 0) &&
                  ((i = Sd(Fd, o) ? 16 : 8), (o = kd(o, 8 === i ? 1 : 2))),
                '' === o)
              )
                a = 0;
              else {
                if (!Sd(10 === i ? Dd : 8 === i ? Bd : zd, o)) return t;
                a = yd(o, i);
              }
              Rd(r, a);
            }
            for (n = 0; n < e; n++)
              if (((a = r[n]), n === e - 1)) {
                if (a >= bd(256, 5 - e)) return null;
              } else if (a > 255) return null;
            for (u = xd(r), n = 0; n < r.length; n++) u += r[n] * bd(256, 3 - n);
            return u;
          })(t)),
          null === e)
        )
          return Ld;
        this.host = e;
      } else {
        if (Sd(qd, t)) return Ld;
        for (e = '', r = Wn(t), n = 0; n < r.length; n++) e += Qd(r[n], Vd);
        this.host = e;
      }
    },
    cannotHaveUsernamePasswordPort: function () {
      return !this.host || this.cannotBeABaseURL || 'file' === this.scheme;
    },
    includesCredentials: function () {
      return '' !== this.username || '' !== this.password;
    },
    isSpecial: function () {
      return ut(Zd, this.scheme);
    },
    shortenPath: function () {
      const t = this.path;
      const e = t.length;
      !e || ('file' === this.scheme && 1 === e && tg(t[0], !0)) || t.length--;
    },
    serialize: function () {
      const e = this.scheme;
      const r = this.username;
      const n = this.password;
      const o = this.host;
      const i = this.port;
      const a = this.path;
      const u = this.query;
      const s = this.fragment;
      let c = `${e}:`;
      return (
        null !== o
          ? ((c += '//'),
            this.includesCredentials() && (c += `${r + (n ? `:${n}` : '')}@`),
            (c += Gd(o)),
            null !== i && (c += `:${i}`))
          : 'file' === e && (c += '//'),
        (c += this.cannotBeABaseURL ? a[0] : a.length ? `/${Ed(a, '/')}` : ''),
        null !== u && (c += `?${u}`),
        null !== s && (c += `#${s}`),
        c
      );
    },
    setHref: function (t) {
      const e = this.parse(t);
      if (e) throw new gd(e);
      this.searchParams.update();
    },
    getOrigin: function () {
      const t = this.scheme;
      const e = this.port;
      if ('blob' === t)
        try {
          return new Rg(t.path[0]).origin;
        } catch (_t) {
          return 'null';
        }
      return 'file' !== t && this.isSpecial()
        ? `${t}://${Gd(this.host)}${null !== e ? `:${e}` : ''}`
        : 'null';
    },
    getProtocol: function () {
      return `${this.scheme}:`;
    },
    setProtocol: function (t) {
      this.parse(`${Wr(t)}:`, ng);
    },
    getUsername: function () {
      return this.username;
    },
    setUsername: function (t) {
      const e = Wn(Wr(t));
      if (!this.cannotHaveUsernamePasswordPort()) {
        this.username = '';
        for (let r = 0; r < e.length; r++) this.username += Qd(e[r], Jd);
      }
    },
    getPassword: function () {
      return this.password;
    },
    setPassword: function (t) {
      const e = Wn(Wr(t));
      if (!this.cannotHaveUsernamePasswordPort()) {
        this.password = '';
        for (let r = 0; r < e.length; r++) this.password += Qd(e[r], Jd);
      }
    },
    getHost: function () {
      const t = this.host;
      const e = this.port;
      return null === t ? '' : null === e ? Gd(t) : `${Gd(t)}:${e}`;
    },
    setHost: function (t) {
      this.cannotBeABaseURL || this.parse(t, pg);
    },
    getHostname: function () {
      const t = this.host;
      return null === t ? '' : Gd(t);
    },
    setHostname: function (t) {
      this.cannotBeABaseURL || this.parse(t, vg);
    },
    getPort: function () {
      const t = this.port;
      return null === t ? '' : Wr(t);
    },
    setPort: function (t) {
      this.cannotHaveUsernamePasswordPort() ||
        ('' === (t = Wr(t)) ? (this.port = null) : this.parse(t, dg));
    },
    getPathname: function () {
      const t = this.path;
      return this.cannotBeABaseURL ? t[0] : t.length ? `/${Ed(t, '/')}` : '';
    },
    setPathname: function (t) {
      this.cannotBeABaseURL || ((this.path = []), this.parse(t, bg));
    },
    getSearch: function () {
      const t = this.query;
      return t ? `?${t}` : '';
    },
    setSearch: function (t) {
      '' === (t = Wr(t))
        ? (this.query = null)
        : ('?' === wd(t, 0) && (t = kd(t, 1)), (this.query = ''), this.parse(t, Eg)),
        this.searchParams.update();
    },
    getSearchParams: function () {
      return this.searchParams.facade;
    },
    getHash: function () {
      const t = this.fragment;
      return t ? `#${t}` : '';
    },
    setHash: function (t) {
      '' !== (t = Wr(t))
        ? ('#' === wd(t, 0) && (t = kd(t, 1)), (this.fragment = ''), this.parse(t, Og))
        : (this.fragment = null);
    },
    update: function () {
      this.query = this.searchParams.serialize() || null;
    },
  };
  const Rg = function (t) {
    const e = ko(this, Pg);
    const r = Up(arguments.length, 1) > 1 ? arguments[1] : void 0;
    const n = ld(e, new xg(t, !1, r));
    u ||
      ((e.href = n.serialize()),
      (e.origin = n.getOrigin()),
      (e.protocol = n.getProtocol()),
      (e.username = n.getUsername()),
      (e.password = n.getPassword()),
      (e.host = n.getHost()),
      (e.hostname = n.getHostname()),
      (e.port = n.getPort()),
      (e.pathname = n.getPathname()),
      (e.search = n.getSearch()),
      (e.searchParams = n.getSearchParams()),
      (e.hash = n.getHash()));
  };
  const Pg = Rg.prototype;
  const Ag = (t, e) => ({
    get: function () {
      return hd(this)[t]();
    },
    set:
      e &&
      function (t) {
        return hd(this)[e](t);
      },
    configurable: !0,
    enumerable: !0,
  });
  if (
    (u &&
      (so(Pg, 'href', Ag('serialize', 'setHref')),
      so(Pg, 'origin', Ag('getOrigin')),
      so(Pg, 'protocol', Ag('getProtocol', 'setProtocol')),
      so(Pg, 'username', Ag('getUsername', 'setUsername')),
      so(Pg, 'password', Ag('getPassword', 'setPassword')),
      so(Pg, 'host', Ag('getHost', 'setHost')),
      so(Pg, 'hostname', Ag('getHostname', 'setHostname')),
      so(Pg, 'port', Ag('getPort', 'setPort')),
      so(Pg, 'pathname', Ag('getPathname', 'setPathname')),
      so(Pg, 'search', Ag('getSearch', 'setSearch')),
      so(Pg, 'searchParams', Ag('getSearchParams')),
      so(Pg, 'hash', Ag('getHash', 'setHash'))),
    ie(
      Pg,
      'toJSON',
      function () {
        return hd(this).serialize();
      },
      { enumerable: !0 }
    ),
    ie(
      Pg,
      'toString',
      function () {
        return hd(this).serialize();
      },
      { enumerable: !0 }
    ),
    dd)
  ) {
    const jg = dd.createObjectURL;
    const kg = dd.revokeObjectURL;
    jg && ie(Rg, 'createObjectURL', ar(jg, dd)), kg && ie(Rg, 'revokeObjectURL', ar(kg, dd));
  }
  an(Rg, 'URL'), Ce({ global: !0, constructor: !0, forced: !Mp, sham: !u }, { URL: Rg });
  const Ig = L('URL');
  const Tg =
    Mp &&
    a(() => {
      Ig.canParse();
    });
  const Mg = a(() => 1 !== Ig.canParse.length);
  Ce(
    { target: 'URL', stat: !0, forced: !Tg || Mg },
    {
      canParse: (t) => {
        const e = Up(arguments.length, 1);
        const r = Wr(t);
        const n = e < 2 || void 0 === arguments[1] ? void 0 : Wr(arguments[1]);
        try {
          return !!new Ig(r, n);
        } catch (_t) {
          return !1;
        }
      },
    }
  );
  const Lg = L('URL');
  Ce(
    { target: 'URL', stat: !0, forced: !Mp },
    {
      parse: (t) => {
        const e = Up(arguments.length, 1);
        const r = Wr(t);
        const n = e < 2 || void 0 === arguments[1] ? void 0 : Wr(arguments[1]);
        try {
          return new Lg(r, n);
        } catch (_t) {
          return null;
        }
      },
    }
  ),
    Ce(
      { target: 'URL', proto: !0, enumerable: !0 },
      {
        toJSON: function () {
          return f(URL.prototype.toString, this);
        },
      }
    );
  const Ug = WeakMap.prototype;
  const Ng = {
    WeakMap: WeakMap,
    set: b(Ug.set),
    get: b(Ug.get),
    has: b(Ug.has),
    remove: b(Ug.delete),
  };
  const Cg = Ng.has;
  const _g = (t) => (Cg(t), t);
  const Fg = Ng.get;
  const Bg = Ng.has;
  const Dg = Ng.set;
  Ce(
    { target: 'WeakMap', proto: !0, real: !0, forced: !0 },
    {
      emplace: function (t, e) {
        let r;
        let n;
        const o = _g(this);
        return Bg(o, t)
          ? ((r = Fg(o, t)), 'update' in e && ((r = e.update(r, t, o)), Dg(o, t, r)), r)
          : ((n = e.insert(t, o)), Dg(o, t, n), n);
      },
    }
  ),
    Ce({ target: 'WeakMap', stat: !0, forced: !0 }, { from: ei(Ng.WeakMap, Ng.set, !0) }),
    Ce({ target: 'WeakMap', stat: !0, forced: !0 }, { of: ri(Ng.WeakMap, Ng.set, !0) });
  const zg = Ng.remove;
  Ce(
    { target: 'WeakMap', proto: !0, real: !0, forced: !0 },
    {
      deleteAll: function () {
        for (let t, e = _g(this), r = !0, n = 0, o = arguments.length; n < o; n++)
          (t = zg(e, arguments[n])), (r = r && t);
        return !!r;
      },
    }
  ),
    Ce({ target: 'WeakMap', proto: !0, real: !0, forced: !0 }, { upsert: Ii }),
    To(
      'WeakSet',
      (t) =>
        function () {
          return t(this, arguments.length ? arguments[0] : void 0);
        },
      eu
    );
  const Wg = WeakSet.prototype;
  const qg = { WeakSet: WeakSet, add: b(Wg.add), has: b(Wg.has), remove: b(Wg.delete) };
  const Hg = qg.has;
  const $g = (t) => (Hg(t), t);
  const Kg = qg.add;
  Ce(
    { target: 'WeakSet', proto: !0, real: !0, forced: !0 },
    {
      addAll: function () {
        for (let t = $g(this), e = 0, r = arguments.length; e < r; e++) Kg(t, arguments[e]);
        return t;
      },
    }
  );
  const Gg = qg.remove;
  Ce(
    { target: 'WeakSet', proto: !0, real: !0, forced: !0 },
    {
      deleteAll: function () {
        for (let t, e = $g(this), r = !0, n = 0, o = arguments.length; n < o; n++)
          (t = Gg(e, arguments[n])), (r = r && t);
        return !!r;
      },
    }
  ),
    Ce({ target: 'WeakSet', stat: !0, forced: !0 }, { from: ei(qg.WeakSet, qg.add, !1) }),
    Ce({ target: 'WeakSet', stat: !0, forced: !0 }, { of: ri(qg.WeakSet, qg.add, !1) });
  const Vg = Error;
  const Yg = b(''.replace);
  const Xg = String(new Vg('zxcasd').stack);
  const Jg = /\n\s*at [^:]*:[^\n]*/;
  const Qg = Jg.test(Xg);
  const Zg = !a(() => {
    const t = new Error('a');
    return !('stack' in t) || (Object.defineProperty(t, 'stack', d(1, 7)), 7 !== t.stack);
  });
  const ty = Error.captureStackTrace;
  const ey = dt('toStringTag');
  const ry = Error;
  const ny = [].push;
  const oy = function (t, e) {
    let r;
    let n;
    let o;
    let i;
    let a;
    const u = U(iy, this);
    dn ? (r = dn(new ry(), u ? Qr(this) : iy)) : ((r = u ? this : Ve(iy)), _t(r, ey, 'Error')),
      void 0 !== e &&
        _t(r, 'message', ((t, e) => (void 0 === t ? (arguments.length < 2 ? '' : e) : Wr(t)))(e)),
      (i = r),
      (a = r.stack),
      Zg &&
        (ty
          ? ty(i, oy)
          : _t(
              i,
              'stack',
              ((t, e) => {
                if (Qg && 'string' === typeof t && !Vg.prepareStackTrace)
                  while (e--) t = Yg(t, Jg, '');
                return t;
              })(a, 1)
            )),
      arguments.length > 2 &&
        ((n = r), M((o = arguments[2])) && 'cause' in o && _t(n, 'cause', o.cause));
    const s = [];
    return Ao(t, ny, { that: s }), _t(r, 'errors', s), r;
  };
  dn ? dn(oy, ry) : Ae(oy, ry, { name: !0 });
  const iy = (oy.prototype = Ve(ry.prototype, {
    constructor: d(1, oy),
    message: d(1, ''),
    name: d(1, 'AggregateError'),
  }));
  Ce({ global: !0, constructor: !0, arity: 2 }, { AggregateError: oy });
  let ay;
  let uy;
  let sy;
  let cy;
  const fy = (t) => _.slice(0, t.length) === t;
  const ly = fy('Bun/')
    ? 'BUN'
    : fy('Cloudflare-Workers')
      ? 'CLOUDFLARE'
      : fy('Deno/')
        ? 'DENO'
        : fy('Node.js/')
          ? 'NODE'
          : i.Bun && 'string' === typeof Bun.version
            ? 'BUN'
            : i.Deno && 'object' === typeof Deno.version
              ? 'DENO'
              : 'process' === E(i.process)
                ? 'NODE'
                : i.window && i.document
                  ? 'BROWSER'
                  : 'REST';
  const hy = 'NODE' === ly;
  const py = /(?:ipad|iphone|ipod).*applewebkit/i.test(_);
  let vy = i.setImmediate;
  let dy = i.clearImmediate;
  const gy = i.process;
  const yy = i.Dispatch;
  const my = i.Function;
  const by = i.MessageChannel;
  const wy = i.String;
  let Sy = 0;
  const Ey = {};
  const Oy = 'onreadystatechange';
  a(() => {
    ay = i.location;
  });
  const xy = (t) => {
    if (ut(Ey, t)) {
      const e = Ey[t];
      delete Ey[t], e();
    }
  };
  const Ry = (t) => () => {
    xy(t);
  };
  const Py = (t) => {
    xy(t.data);
  };
  const Ay = (t) => {
    i.postMessage(wy(t), `${ay.protocol}//${ay.host}`);
  };
  (vy && dy) ||
    ((vy = (t) => {
      Up(arguments.length, 1);
      const e = T(t) ? t : my(t);
      const r = vo(arguments, 1);
      return (
        (Ey[++Sy] = () => {
          Ra(e, void 0, r);
        }),
        uy(Sy),
        Sy
      );
    }),
    (dy = (t) => {
      delete Ey[t];
    }),
    hy
      ? (uy = (t) => {
          gy.nextTick(Ry(t));
        })
      : yy?.now
        ? (uy = (t) => {
            yy.now(Ry(t));
          })
        : by && !py
          ? ((cy = (sy = new by()).port2), (sy.port1.onmessage = Py), (uy = ar(cy.postMessage, cy)))
          : i.addEventListener &&
              T(i.postMessage) &&
              !i.importScripts &&
              ay &&
              'file:' !== ay.protocol &&
              !a(Ay)
            ? ((uy = Ay), i.addEventListener('message', Py, !1))
            : (uy =
                Oy in Et('script')
                  ? (t) => {
                      De.appendChild(Et('script'))[Oy] = function () {
                        De.removeChild(this), xy(t);
                      };
                    }
                  : (t) => {
                      setTimeout(Ry(t), 0);
                    }));
  const jy = { set: vy, clear: dy };
  const ky = function () {
    (this.head = null), (this.tail = null);
  };
  ky.prototype = {
    add: function (t) {
      const e = { item: t, next: null };
      const r = this.tail;
      r ? (r.next = e) : (this.head = e), (this.tail = e);
    },
    get: function () {
      const t = this.head;
      if (t) return null === (this.head = t.next) && (this.tail = null), t.item;
    },
  };
  let Iy;
  let Ty;
  let My;
  let Ly;
  let Uy;
  const Ny = ky;
  const Cy = /ipad|iphone|ipod/i.test(_) && 'undefined' !== typeof Pebble;
  const _y = /web0s(?!.*chrome)/i.test(_);
  let Fy = jy.set;
  const By = i.MutationObserver || i.WebKitMutationObserver;
  const Dy = i.document;
  const zy = i.process;
  const Wy = i.Promise;
  let qy = Ip('queueMicrotask');
  if (!qy) {
    const Hy = new Ny();
    const $y = () => {
      let t;
      let e;
      for (hy && (t = zy.domain) && t.exit(); (e = Hy.get()); )
        try {
          e();
        } catch (t) {
          throw (Hy.head && Iy(), t);
        }
      t?.enter();
    };
    py || hy || _y || !By || !Dy
      ? !Cy && Wy && Wy.resolve
        ? (((Ly = Wy.resolve(void 0)).constructor = Wy),
          (Uy = ar(Ly.then, Ly)),
          (Iy = () => {
            Uy($y);
          }))
        : hy
          ? (Iy = () => {
              zy.nextTick($y);
            })
          : ((Fy = ar(Fy, i)),
            (Iy = () => {
              Fy($y);
            }))
      : ((Ty = !0),
        (My = Dy.createTextNode('')),
        new By($y).observe(My, { characterData: !0 }),
        (Iy = () => {
          My.data = Ty = !Ty;
        })),
      (qy = (t) => {
        Hy.head || Iy(), Hy.add(t);
      });
  }
  let Ky;
  let Gy;
  let Vy;
  const Yy = qy;
  const Xy = (t) => {
    try {
      return { error: !1, value: t() };
    } catch (t) {
      return { error: !0, value: t };
    }
  };
  const Jy = i.Promise;
  const Qy = dt('species');
  let Zy = !1;
  const tm = T(i.PromiseRejectionEvent);
  const em = Ue('Promise', () => {
    const t = Kt(Jy);
    const e = t !== String(Jy);
    if (!e && 66 === W) return !0;
    if (!W || W < 51 || !/native code/.test(t)) {
      const r = new Jy((t) => {
        t(1);
      });
      const n = (t) => {
        t(
          () => {},
          () => {}
        );
      };
      if ((((r.constructor = {})[Qy] = n), !(Zy = r.then(() => {}) instanceof n))) return !0;
    }
    return !(e || ('BROWSER' !== ly && 'DENO' !== ly) || tm);
  });
  const rm = { CONSTRUCTOR: em, REJECTION_EVENT: tm, SUBCLASSING: Zy };
  const nm = TypeError;
  const om = function (t) {
    let e;
    let r;
    (this.promise = new t((t, n) => {
      if (void 0 !== e || void 0 !== r) throw new nm('Bad Promise constructor');
      (e = t), (r = n);
    })),
      (this.resolve = J(e)),
      (this.reject = J(r));
  };
  const im = { f: (t) => new om(t) };
  const am = jy.set;
  const um = 'Promise';
  const sm = rm.CONSTRUCTOR;
  const cm = rm.REJECTION_EVENT;
  const fm = rm.SUBCLASSING;
  const lm = ne.getterFor(um);
  const hm = ne.set;
  const pm = Jy?.prototype;
  let vm = Jy;
  let dm = pm;
  const gm = i.TypeError;
  const ym = i.document;
  const mm = i.process;
  let bm = im.f;
  const wm = bm;
  const Sm = !!(ym?.createEvent && i.dispatchEvent);
  const Em = 'unhandledrejection';
  const Om = (t) => {
    let e;
    return !(!M(t) || !T((e = t.then))) && e;
  };
  const xm = (t, e) => {
    let r;
    let n;
    let o;
    const i = e.value;
    const a = 1 === e.state;
    const u = a ? t.ok : t.fail;
    const s = t.resolve;
    const c = t.reject;
    const l = t.domain;
    try {
      u
        ? (a || (2 === e.rejection && km(e), (e.rejection = 1)),
          !0 === u ? (r = i) : (l?.enter(), (r = u(i)), l && (l.exit(), (o = !0))),
          r === t.promise ? c(new gm('Promise-chain cycle')) : (n = Om(r)) ? f(n, r, s, c) : s(r))
        : c(i);
    } catch (t) {
      l && !o && l.exit(), c(t);
    }
  };
  const Rm = (t, e) => {
    t.notified ||
      ((t.notified = !0),
      Yy(() => {
        for (let r, n = t.reactions; (r = n.get()); ) xm(r, t);
        (t.notified = !1), e && !t.rejection && Am(t);
      }));
  };
  const Pm = (t, e, r) => {
    let n;
    let o;
    Sm
      ? (((n = ym.createEvent('Event')).promise = e),
        (n.reason = r),
        n.initEvent(t, !1, !0),
        i.dispatchEvent(n))
      : (n = { promise: e, reason: r }),
      !cm && (o = i[`on${t}`])
        ? o(n)
        : t === Em &&
          ((t, e) => {
            try {
              1 === arguments.length ? console.error(t) : console.error(t, e);
            } catch (_t) {}
          })('Unhandled promise rejection', r);
  };
  const Am = (t) => {
    f(am, i, () => {
      let e;
      const r = t.facade;
      const n = t.value;
      if (
        jm(t) &&
        ((e = Xy(() => {
          hy ? mm.emit('unhandledRejection', n, r) : Pm(Em, r, n);
        })),
        (t.rejection = hy || jm(t) ? 2 : 1),
        e.error)
      )
        throw e.value;
    });
  };
  const jm = (t) => 1 !== t.rejection && !t.parent;
  const km = (t) => {
    f(am, i, () => {
      const e = t.facade;
      hy ? mm.emit('rejectionHandled', e) : Pm('rejectionhandled', e, t.value);
    });
  };
  const Im = (t, e, r) => (n) => {
    t(e, n, r);
  };
  const Tm = (t, e, r) => {
    t.done || ((t.done = !0), r && (t = r), (t.value = e), (t.state = 2), Rm(t, !0));
  };
  const Mm = (t, e, r) => {
    if (!t.done) {
      (t.done = !0), r && (t = r);
      try {
        if (t.facade === e) throw new gm("Promise can't be resolved itself");
        const n = Om(e);
        n
          ? Yy(() => {
              const r = { done: !1 };
              try {
                f(n, e, Im(Mm, r, t), Im(Tm, r, t));
              } catch (e) {
                Tm(r, e, t);
              }
            })
          : ((t.value = e), (t.state = 1), Rm(t, !1));
      } catch (e) {
        Tm({ done: !1 }, e, t);
      }
    }
  };
  if (
    sm &&
    ((vm = function (t) {
      ko(this, dm), J(t), f(Ky, this);
      const e = lm(this);
      try {
        t(Im(Mm, e), Im(Tm, e));
      } catch (t) {
        Tm(e, t);
      }
    }),
    ((Ky = function (_t) {
      hm(this, {
        type: um,
        done: !1,
        notified: !1,
        parent: !1,
        reactions: new Ny(),
        rejection: !1,
        state: 0,
        value: null,
      });
    }).prototype = ie((dm = vm.prototype), 'then', function (t, e) {
      const r = lm(this);
      const n = bm(Cc(this, vm));
      return (
        (r.parent = !0),
        (n.ok = !T(t) || t),
        (n.fail = T(e) && e),
        (n.domain = hy ? mm.domain : void 0),
        0 === r.state
          ? r.reactions.add(n)
          : Yy(() => {
              xm(n, r);
            }),
        n.promise
      );
    })),
    (Gy = function () {
      const t = new Ky();
      const e = lm(t);
      (this.promise = t), (this.resolve = Im(Mm, e)), (this.reject = Im(Tm, e));
    }),
    (im.f = bm = (t) => (t === vm || void 0 === t ? new Gy(t) : wm(t))),
    T(Jy) && pm !== Object.prototype)
  ) {
    (Vy = pm.then),
      fm ||
        ie(
          pm,
          'then',
          function (t, e) {
            return new vm((t, e) => {
              f(Vy, this, t, e);
            }).then(t, e);
          },
          { unsafe: !0 }
        );
    try {
      pm.constructor = undefined;
    } catch (_t) {}
    dn?.(pm, dm);
  }
  Ce({ global: !0, constructor: !0, wrap: !0, forced: sm }, { Promise: vm }),
    an(vm, um, !1),
    Uo(um);
  const Lm =
    rm.CONSTRUCTOR ||
    !Gn((t) => {
      Jy.all(t).then(void 0, () => {});
    });
  Ce(
    { target: 'Promise', stat: !0, forced: Lm },
    {
      all: function (t) {
        const r = im.f(this);
        const n = r.resolve;
        const o = r.reject;
        const i = Xy(() => {
          const r = J(this.resolve);
          const i = [];
          let a = 0;
          let u = 1;
          Ao(t, (t) => {
            const s = a++;
            let c = !1;
            u++,
              f(r, this, t).then((t) => {
                c || ((c = !0), (i[s] = t), --u || n(i));
              }, o);
          }),
            --u || n(i);
        });
        return i.error && o(i.value), r.promise;
      },
    }
  );
  const Um = Jy?.prototype;
  if (
    (Ce(
      { target: 'Promise', proto: !0, forced: rm.CONSTRUCTOR, real: !0 },
      {
        catch: function (t) {
          return this.then(void 0, t);
        },
      }
    ),
    T(Jy))
  ) {
    const Nm = L('Promise').prototype.catch;
    Um.catch !== Nm && ie(Um, 'catch', Nm, { unsafe: !0 });
  }
  Ce(
    { target: 'Promise', stat: !0, forced: Lm },
    {
      race: function (t) {
        const r = im.f(this);
        const n = r.reject;
        const o = Xy(() => {
          const o = J(this.resolve);
          Ao(t, (t) => {
            f(o, this, t).then(r.resolve, n);
          });
        });
        return o.error && n(o.value), r.promise;
      },
    }
  ),
    Ce(
      { target: 'Promise', stat: !0, forced: rm.CONSTRUCTOR },
      {
        reject: function (t) {
          const e = im.f(this);
          return (0, e.reject)(t), e.promise;
        },
      }
    );
  const Cm = (t, e) => {
    if ((kt(t), M(e) && e.constructor === t)) return e;
    const r = im.f(t);
    return (0, r.resolve)(e), r.promise;
  };
  Ce(
    { target: 'Promise', stat: !0, forced: rm.CONSTRUCTOR },
    {
      resolve: function (t) {
        return Cm(this, t);
      },
    }
  ),
    Ce(
      { target: 'Promise', stat: !0, forced: Lm },
      {
        allSettled: function (t) {
          const r = im.f(this);
          const n = r.resolve;
          const o = r.reject;
          const i = Xy(() => {
            const r = J(this.resolve);
            const o = [];
            let i = 0;
            let a = 1;
            Ao(t, (t) => {
              const u = i++;
              let s = !1;
              a++,
                f(r, this, t).then(
                  (t) => {
                    s || ((s = !0), (o[u] = { status: 'fulfilled', value: t }), --a || n(o));
                  },
                  (t) => {
                    s || ((s = !0), (o[u] = { status: 'rejected', reason: t }), --a || n(o));
                  }
                );
            }),
              --a || n(o);
          });
          return i.error && o(i.value), r.promise;
        },
      }
    );
  const _m = 'No one promise resolved';
  Ce(
    { target: 'Promise', stat: !0, forced: Lm },
    {
      any: function (t) {
        const r = L('AggregateError');
        const n = im.f(this);
        const o = n.resolve;
        const i = n.reject;
        const a = Xy(() => {
          const n = J(this.resolve);
          const a = [];
          let u = 0;
          let s = 1;
          let c = !1;
          Ao(t, (t) => {
            const l = u++;
            let h = !1;
            s++,
              f(n, this, t).then(
                (t) => {
                  h || c || ((c = !0), o(t));
                },
                (t) => {
                  h || c || ((h = !0), (a[l] = t), --s || i(new r(a, _m)));
                }
              );
          }),
            --s || i(new r(a, _m));
        });
        return a.error && i(a.value), n.promise;
      },
    }
  ),
    Ce(
      { target: 'Promise', stat: !0 },
      {
        withResolvers: function () {
          const t = im.f(this);
          return { promise: t.promise, resolve: t.resolve, reject: t.reject };
        },
      }
    );
  const Fm = Jy?.prototype;
  const Bm =
    !!Jy &&
    a(() => {
      Fm.finally.call({ then: () => {} }, () => {});
    });
  if (
    (Ce(
      { target: 'Promise', proto: !0, real: !0, forced: Bm },
      {
        finally: function (t) {
          const e = Cc(this, L('Promise'));
          const r = T(t);
          return this.then(
            r ? (r) => Cm(e, t()).then(() => r) : t,
            r
              ? (r) =>
                  Cm(e, t()).then(() => {
                    throw r;
                  })
              : t
          );
        },
      }
    ),
    T(Jy))
  ) {
    const Dm = L('Promise').prototype.finally;
    Fm.finally !== Dm && ie(Fm, 'finally', Dm, { unsafe: !0 });
  }
  const zm = i.Promise;
  let Wm = !1;
  const qm =
    !zm ||
    !zm.try ||
    Xy(() => {
      zm.try((t) => {
        Wm = 8 === t;
      }, 8);
    }).error ||
    !Wm;
  Ce(
    { target: 'Promise', stat: !0, forced: qm },
    {
      try: function (t) {
        const e = arguments.length > 1 ? vo(arguments, 1) : [];
        const r = im.f(this);
        const n = Xy(() => Ra(J(t), void 0, e));
        return (n.error ? r.reject : r.resolve)(n.value), r.promise;
      },
    }
  ),
    Ze('Promise', 'finally');
  const Hm = 'URLSearchParams' in self;
  const $m = 'Symbol' in self && 'iterator' in Symbol;
  const Km =
    'FileReader' in self &&
    'Blob' in self &&
    (() => {
      try {
        return new Blob(), !0;
      } catch (_t) {
        return !1;
      }
    })();
  const Gm = 'FormData' in self;
  const Vm = 'ArrayBuffer' in self;
  if (Vm)
    const Ym=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],Xm=ArrayBuffer.isView||((t)=> t&&Ym.indexOf(Object.prototype.toString.call(t))>-1);
  function Jm(t) {
    if (('string' !== typeof t && (t = String(t)), /[^a-z0-9\-#$%&'*+.^_`|~]/i.test(t)))
      throw new TypeError('Invalid character in header field name');
    return t.toLowerCase();
  }
  function Qm(t) {
    return 'string' !== typeof t && (t = String(t)), t;
  }
  function Zm(t) {
    const e = {
      next: () => {
        const e = t.shift();
        return { done: void 0 === e, value: e };
      },
    };
    return $m && (e[Symbol.iterator] = () => e), e;
  }
  function tb(t) {
    (this.map = {}),
      t instanceof tb
        ? t.forEach(function (t, e) {
            this.append(e, t);
          }, this)
        : Array.isArray(t)
          ? t.forEach(function (t) {
              this.append(t[0], t[1]);
            }, this)
          : t &&
            Object.getOwnPropertyNames(t).forEach(function (e) {
              this.append(e, t[e]);
            }, this);
  }
  function eb(t) {
    if (t.bodyUsed) return Promise.reject(new TypeError('Already read'));
    t.bodyUsed = !0;
  }
  function rb(t) {
    return new Promise((e, r) => {
      (t.onload = () => {
        e(t.result);
      }),
        (t.onerror = () => {
          r(t.error);
        });
    });
  }
  function nb(t) {
    const e = new FileReader();
    const r = rb(e);
    return e.readAsArrayBuffer(t), r;
  }
  function ob(t) {
    if (t.slice) return t.slice(0);
    const e = new Uint8Array(t.byteLength);
    return e.set(new Uint8Array(t)), e.buffer;
  }
  function ib() {
    return (
      (this.bodyUsed = !1),
      (this._initBody = function (t) {
        let e;
        (this._bodyInit = t),
          t
            ? 'string' === typeof t
              ? (this._bodyText = t)
              : Km && Blob.prototype.isPrototypeOf(t)
                ? (this._bodyBlob = t)
                : Gm && FormData.prototype.isPrototypeOf(t)
                  ? (this._bodyFormData = t)
                  : Hm && URLSearchParams.prototype.isPrototypeOf(t)
                    ? (this._bodyText = t.toString())
                    : Vm && Km && (e = t) && DataView.prototype.isPrototypeOf(e)
                      ? ((this._bodyArrayBuffer = ob(t.buffer)),
                        (this._bodyInit = new Blob([this._bodyArrayBuffer])))
                      : Vm && (ArrayBuffer.prototype.isPrototypeOf(t) || Xm(t))
                        ? (this._bodyArrayBuffer = ob(t))
                        : (this._bodyText = t = Object.prototype.toString.call(t))
            : (this._bodyText = ''),
          this.headers.get('content-type') ||
            ('string' === typeof t
              ? this.headers.set('content-type', 'text/plain;charset=UTF-8')
              : this._bodyBlob?.type
                ? this.headers.set('content-type', this._bodyBlob.type)
                : Hm &&
                  URLSearchParams.prototype.isPrototypeOf(t) &&
                  this.headers.set(
                    'content-type',
                    'application/x-www-form-urlencoded;charset=UTF-8'
                  ));
      }),
      Km &&
        ((this.blob = function () {
          const t = eb(this);
          if (t) return t;
          if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer) return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData) throw new Error('could not read FormData body as blob');
          return Promise.resolve(new Blob([this._bodyText]));
        }),
        (this.arrayBuffer = function () {
          return this._bodyArrayBuffer
            ? eb(this) || Promise.resolve(this._bodyArrayBuffer)
            : this.blob().then(nb);
        })),
      (this.text = function () {
        const t = eb(this);
        if (t) return t;
        if (this._bodyBlob)
          return ((t) => {
            const e = new FileReader();
            const r = rb(e);
            return e.readAsText(t), r;
          })(this._bodyBlob);
        if (this._bodyArrayBuffer)
          return Promise.resolve(
            ((t) => {
              for (let e = new Uint8Array(t), r = new Array(e.length), n = 0; n < e.length; n++)
                r[n] = String.fromCharCode(e[n]);
              return r.join('');
            })(this._bodyArrayBuffer)
          );
        if (this._bodyFormData) throw new Error('could not read FormData body as text');
        return Promise.resolve(this._bodyText);
      }),
      Gm &&
        (this.formData = function () {
          return this.text().then(sb);
        }),
      (this.json = function () {
        return this.text().then(JSON.parse);
      }),
      this
    );
  }
  (tb.prototype.append = function (t, e) {
    (t = Jm(t)), (e = Qm(e));
    const r = this.map[t];
    this.map[t] = r ? `${r}, ${e}` : e;
  }),
    (tb.prototype.delete = function (t) {
      delete this.map[Jm(t)];
    }),
    (tb.prototype.get = function (t) {
      return (t = Jm(t)), this.has(t) ? this.map[t] : null;
    }),
    (tb.prototype.has = function (t) {
      return  Object.hasOwn(this.map, Jm(t));
    }),
    (tb.prototype.set = function (t, e) {
      this.map[Jm(t)] = Qm(e);
    }),
    (tb.prototype.forEach = function (t, e) {
      for (const r in this.map) Object.hasOwn(this.map, r) && t.call(e, this.map[r], r, this);
    }),
    (tb.prototype.keys = function () {
      const t = [];
      return (
        this.forEach((_e, r) => {
          t.push(r);
        }),
        Zm(t)
      );
    }),
    (tb.prototype.values = function () {
      const t = [];
      return (
        this.forEach((e) => {
          t.push(e);
        }),
        Zm(t)
      );
    }),
    (tb.prototype.entries = function () {
      const t = [];
      return (
        this.forEach((e, r) => {
          t.push([r, e]);
        }),
        Zm(t)
      );
    }),
    $m && (tb.prototype[Symbol.iterator] = tb.prototype.entries);
  const ab = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
  function ub(t, e) {
    let r = (e = e || {}).body;
    if (t instanceof ub) {
      if (t.bodyUsed) throw new TypeError('Already read');
      (this.url = t.url),
        (this.credentials = t.credentials),
        e.headers || (this.headers = new tb(t.headers)),
        (this.method = t.method),
        (this.mode = t.mode),
        (this.signal = t.signal),
        r || null == t._bodyInit || ((r = t._bodyInit), (t.bodyUsed = !0));
    } else this.url = String(t);
    if (
      ((this.credentials = e.credentials || this.credentials || 'same-origin'),
      (!e.headers && this.headers) || (this.headers = new tb(e.headers)),
      (this.method = ((t) => {
        const e = t.toUpperCase();
        return ab.indexOf(e) > -1 ? e : t;
      })(e.method || this.method || 'GET')),
      (this.mode = e.mode || this.mode || null),
      (this.signal = e.signal || this.signal),
      (this.referrer = null),
      ('GET' === this.method || 'HEAD' === this.method) && r)
    )
      throw new TypeError('Body not allowed for GET or HEAD requests');
    this._initBody(r);
  }
  function sb(t) {
    const e = new FormData();
    return (
      t
        .trim()
        .split('&')
        .forEach((t) => {
          if (t) {
            const r = t.split('=');
            const n = r.shift().replace(/\+/g, ' ');
            const o = r.join('=').replace(/\+/g, ' ');
            e.append(decodeURIComponent(n), decodeURIComponent(o));
          }
        }),
      e
    );
  }
  function cb(t, e) {
    e || (e = {}),
      (this.type = 'default'),
      (this.status = void 0 === e.status ? 200 : e.status),
      (this.ok = this.status >= 200 && this.status < 300),
      (this.statusText = 'statusText' in e ? e.statusText : 'OK'),
      (this.headers = new tb(e.headers)),
      (this.url = e.url || ''),
      this._initBody(t);
  }
  (ub.prototype.clone = function () {
    return new ub(this, { body: this._bodyInit });
  }),
    ib.call(ub.prototype),
    ib.call(cb.prototype),
    (cb.prototype.clone = function () {
      return new cb(this._bodyInit, {
        status: this.status,
        statusText: this.statusText,
        headers: new tb(this.headers),
        url: this.url,
      });
    }),
    (cb.error = () => {
      const t = new cb(null, { status: 0, statusText: '' });
      return (t.type = 'error'), t;
    });
  const fb = [301, 302, 303, 307, 308];
  cb.redirect = (t, e) => {
    if (-1 === fb.indexOf(e)) throw new RangeError('Invalid status code');
    return new cb(null, { status: e, headers: { location: t } });
  };
  let lb = self.DOMException;
  try {
    new lb();
  } catch (_t) {
    ((lb = function (t, e) {
      (this.message = t), (this.name = e);
      const r = Error(t);
      this.stack = r.stack;
    }).prototype = Object.create(Error.prototype)),
      (lb.prototype.constructor = lb);
  }
  function hb(t, e) {
    return new Promise((r, n) => {
      const o = new ub(t, e);
      if (o.signal?.aborted) return n(new lb('Aborted', 'AbortError'));
      const i = new XMLHttpRequest();
      function a() {
        i.abort();
      }
      (i.onload = () => {
        let t;
        let e;
        const n = {
          status: i.status,
          statusText: i.statusText,
          headers:
            ((t = i.getAllResponseHeaders() || ''),
            (e = new tb()),
            t
              .replace(/\r?\n[\t ]+/g, ' ')
              .split(/\r?\n/)
              .forEach((t) => {
                const r = t.split(':');
                const n = r.shift().trim();
                if (n) {
                  const o = r.join(':').trim();
                  e.append(n, o);
                }
              }),
            e),
        };
        (n.url = 'responseURL' in i ? i.responseURL : n.headers.get('X-Request-URL')),
          r(new cb('response' in i ? i.response : i.responseText, n));
      }),
        (i.onerror = () => {
          n(new TypeError('Network request failed'));
        }),
        (i.ontimeout = () => {
          n(new TypeError('Network request failed'));
        }),
        (i.onabort = () => {
          n(new lb('Aborted', 'AbortError'));
        }),
        i.open(o.method, o.url, !0),
        'include' === o.credentials
          ? (i.withCredentials = !0)
          : 'omit' === o.credentials && (i.withCredentials = !1),
        'responseType' in i && Km && (i.responseType = 'blob'),
        o.headers.forEach((t, e) => {
          i.setRequestHeader(e, t);
        }),
        o.signal &&
          (o.signal.addEventListener('abort', a),
          (i.onreadystatechange = () => {
            4 === i.readyState && o.signal.removeEventListener('abort', a);
          })),
        i.send(void 0 === o._bodyInit ? null : o._bodyInit);
    });
  }
  (hb.polyfill = !0),
    self.fetch ||
      ((self.fetch = hb), (self.Headers = tb), (self.Request = ub), (self.Response = cb));
  const pb = Object.getOwnPropertySymbols;
  const vb = Object.prototype.hasOwnProperty;
  const db = Object.prototype.propertyIsEnumerable;
  const gb = (() => {
    try {
      if (!Object.assign) return !1;
      const t = new String('abc');
      if (((t[5] = 'de'), '5' === Object.getOwnPropertyNames(t)[0])) return !1;
      for (let e = {}, r = 0; r < 10; r++) e[`_${String.fromCharCode(r)}`] = r;
      if (
        '0123456789' !==
        Object.getOwnPropertyNames(e)
          .map((t) => e[t])
          .join('')
      )
        return !1;
      const n = {};
      return (
        'abcdefghijklmnopqrst'.split('').forEach((t) => {
          n[t] = t;
        }),
        'abcdefghijklmnopqrst' === Object.keys(Object.assign({}, n)).join('')
      );
    } catch (_t) {
      return !1;
    }
  })()
    ? Object.assign
    : (t, _e) => {
        for (
          let r,
            n,
            o = ((t) => {
              if (null == t)
                throw new TypeError('Object.assign cannot be called with null or undefined');
              return Object(t);
            })(t),
            i = 1;
          i < arguments.length;
          i++
        ) {
          for (const a in (r = Object(arguments[i]))) vb.call(r, a) && (o[a] = r[a]);
          if (pb) {
            n = pb(r);
            for (let u = 0; u < n.length; u++) db.call(r, n[u]) && (o[n[u]] = r[n[u]]);
          }
        }
        return o;
      };
  Object.assign = gb;
})();
