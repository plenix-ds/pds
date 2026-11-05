/* global React, ReactDOM, Plenix, DS */
/* Plenix master spec · the rendering helpers for the inventory's pages (inventory.js holds the records):
   - DSRender.example(container, [label, render]): one live example, drawn by the real React components
     (platform/dist/platform.js) with platform.css, in the page's theme; the code under it is written from the element it
     really renders, so it always matches what is shown (the wrappers that only lay the example out, data-ds-wrap, are
     left out).
   - DSRender.header(src): the header comment of a source file (under platform/): [lead (its first sentence), the text].
   - DSRender.text(path): a file's text (under platform/), fetched once.
   Both read the release's source (PlenixSource.at, plenix-source.js), or this checkout's with ?plenix=local. */
(function () {
  var h = React.createElement, P = window.Plenix;

  /* ── the code an element renders, as JSX ── */
  var NAMES = new Map();
  Object.keys(P).forEach(function (k) {
    var v = P[k]; if (!v || (typeof v !== 'function' && typeof v !== 'object')) return;
    NAMES.set(v, k);
    Object.keys(v).forEach(function (sub) { var c = v[sub]; if (c && (typeof c === 'function' || (typeof c === 'object' && c.$$typeof)) && /^[A-Z]/.test(sub)) NAMES.set(c, k + '.' + sub); });
  });
  function tagName(type) {
    if (typeof type === 'string') return type;
    if (type === React.Fragment) return '';
    return NAMES.get(type) || type.displayName || type.name || (type.render && (type.render.displayName || type.render.name)) || 'Component';
  }
  function value(v, pad) {
    if (typeof v === 'function') return '{() => …}';
    if (React.isValidElement(v)) return '{' + jsx(v, pad).trim() + '}';
    if (Array.isArray(v)) {
      var items = v.map(function (x) { return React.isValidElement(x) ? jsx(x, pad + '  ').trim() : literal(x); });
      return items.join(', ').length > 80 ? '{[\n' + items.map(function (x) { return pad + '  ' + x; }).join(',\n') + '\n' + pad + ']}' : '{[' + items.join(', ') + ']}';
    }
    if (typeof v === 'string') return '"' + v.replace(/"/g, '&quot;') + '"';
    return '{' + literal(v) + '}';
  }
  function literal(v) {
    if (typeof v === 'function') return '() => …';
    if (React.isValidElement(v)) return jsx(v, '').trim();
    if (Array.isArray(v)) return '[' + v.map(literal).join(', ') + ']';
    if (v && typeof v === 'object') return '{ ' + Object.keys(v).map(function (k) { return (/^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)) + ': ' + literal(v[k]); }).join(', ') + ' }';
    return JSON.stringify(v);
  }
  function jsx(el, pad) {
    if (el == null || typeof el === 'boolean') return '';
    if (typeof el === 'string' || typeof el === 'number') return pad + String(el).replace(/[{}<>]/g, function (c) { return '{"' + c + '"}'; }) + '\n';
    if (Array.isArray(el)) return el.map(function (x) { return jsx(x, pad); }).join('');
    var props = el.props || {};
    if (props['data-ds-wrap']) return jsx(React.Children.toArray(props.children), pad);   // the example's own layout, not part of the code
    var name = tagName(el.type), attrs = [];
    Object.keys(props).forEach(function (k) {
      if (k === 'children') return;
      var v = props[k];
      if (v === undefined || v === false) return;   // the default for every boolean prop
      attrs.push(v === true ? k : k + '=' + value(v, pad + '  '));
    });
    var kids = React.Children.toArray(props.children);
    var open = '<' + name + (attrs.length ? ' ' + attrs.join(' ') : '');
    if (open.length + pad.length > 110 && attrs.length > 1) open = '<' + name + '\n' + attrs.map(function (a) { return pad + '  ' + a; }).join('\n') + '\n' + pad;
    if (!kids.length) return pad + open + (open.slice(-1) === '\n' ? '' : ' ') + '/>\n';
    if (kids.length === 1 && (typeof kids[0] === 'string' || typeof kids[0] === 'number') && open.indexOf('\n') < 0) return pad + open + '>' + jsx(kids[0], '').trim() + '</' + name + '>\n';
    return pad + open + '>\n' + kids.map(function (k) { return jsx(k, pad + '  '); }).join('') + pad + '</' + name + '>\n';
  }



  function Example(props) {
    var el = props.render(), code = jsx(el, '').trim();
    React.useEffect(function () { if (props.pre.textContent !== code) props.pre.textContent = code; });
    return el;
  }

  /* the header comment of a source file, without its "Plenix · Name" prefix: [lead (the first sentence), API text] */
  var SRC = {};
  /* a header comment in the structured form (batch 162): "Summary:", "Usage:", "Props:", "Behavior:", "Notes:" at a
     3-space indent; their lines at 5 spaces (deeper lines continue the one above). Returns { summary, usage, props:
     [[name, text]], behavior: [line], notes: [line] }, or null for a comment in the old free form. */
  function structured(c) {
    var lines = c.split('\n'), out = { summary: '', usage: '', props: [], behavior: [], notes: [] }, cur = null, seen = false;
    lines.forEach(function (l) {
      var s = /^\s{3}(Summary|Usage|Props|Behavior|Notes):\s?(.*)$/.exec(l);
      if (s) { cur = s[1].toLowerCase(); seen = true; if (s[2]) add(s[2], 5); return; }
      if (cur) add(l.replace(/^\s{5}/, ''), (/^\s*/.exec(l) || [''])[0].length);
    });
    function add(t, indent) {
      if (!t.trim() && cur !== 'usage') return;
      if (cur === 'summary') out.summary += (out.summary ? ' ' : '') + t.trim();
      else if (cur === 'usage') out.usage += (out.usage ? '\n' : '') + t;
      else if (cur === 'props') {
        var m = indent <= 5 && /^(\S+?(?:\([^)]*\))?):\s(.*)$/.exec(t.trim());
        if (m) out.props.push([m[1], m[2]]); else if (out.props.length) out.props[out.props.length - 1][1] += ' ' + t.trim();
      } else if (indent <= 5 || !out[cur].length) out[cur].push(t.trim());
      else out[cur][out[cur].length - 1] += ' ' + t.trim();
    }
    out.usage = out.usage.replace(/\s+$/, '');
    return seen ? out : null;
  }
  // the defaults a component's function gives its props: { name: 'value as written' }; a TypeScript component's props type
  // after the braces ({ … }: PortalProps) is read past
  function defaultsOf(jsx) {
    var m = /export\s+(?:const\s+\w+\s*=\s*(?:React\.forwardRef\()?)?function\s*\w*\s*\(\{([\s\S]*?)\}\s*(?::\s*[\w$.<>\[\]|&, ]+?)?\s*[,)]/.exec(jsx || ''); if (!m) return {};
    var out = {}, depth = 0, cur = '', q = null;
    (m[1] + ',').split('').forEach(function (ch) {
      if (q) { cur += ch; if (ch === q) q = null; return; }
      if (ch === "'" || ch === '"' || ch === '`') { q = ch; cur += ch; return; }
      if ('([{'.indexOf(ch) >= 0) depth++; if (')]}'.indexOf(ch) >= 0) depth--;
      if (ch === ',' && depth === 0) { var d = /^\s*(\w+)\s*=\s*([\s\S]+?)\s*$/.exec(cur); if (d) out[d[1]] = d[2]; cur = ''; return; }
      cur += ch;
    });
    return out;
  }
  function header(src) {
    if (!SRC[src]) SRC[src] = fetch(PlenixSource.at(src), { cache: 'no-store' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (t) {
      t = t.replace(/\r\n?/g, '\n');   // a file saved with Windows line endings reads the same (batch 223)
      var m = /^\s*\/\*([\s\S]*?)\*\//.exec(t); if (!m) return ['', ''];
      var body = m[1].split('\n').map(function (l) { return l.replace(/^\s{0,3}/, ''); }).join('\n').trim()
        .replace(/^Plenix · [^:]+?(\s\([^)]*\))?:\s*/, '');
      var lead = (/^[\s\S]*?[.!?](\s|$)/.exec(body) || [body])[0].trim();
      var parts = structured(m[1]);
      if (parts) lead = (/^[\s\S]*?[.!?](\s|$)/.exec(parts.summary) || [parts.summary])[0].trim();
      return [lead.charAt(0).toUpperCase() + lead.slice(1), body, parts];
    });
    return SRC[src];
  }

  var TEXT = {};
  function text(path) {
    if (!TEXT[path]) TEXT[path] = fetch(PlenixSource.at(path), { cache: 'no-store' }).then(function (r) { return r.ok ? r.text() : ''; });
    return TEXT[path];
  }

  window.DSRender = {
    header: header,
    defaults: defaultsOf,
    text: text,
    jsx: function (el) { return jsx(el, '').trim(); },
    example: function (container, ex) {
      var boxEl = DS.el('div', 'ds-example'), headEl = DS.el('div', 'ds-example-head', ex[0]), stage = DS.el('div', 'ds-live'), pre = DS.el('pre', 'ds-code', '');
      boxEl.appendChild(headEl); boxEl.appendChild(stage); boxEl.appendChild(pre); container.appendChild(boxEl);
      ReactDOM.createRoot(stage).render(h(P.ThemeProvider, null, h(P.ToastProvider, null, h(Example, { render: ex[1], pre: pre }))));
    }
  };
})();
