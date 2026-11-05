/* Plenix design system · library part w04B: the labs of wave 4, lane B. The availability indicator (StatusDot's presence
   tones, and the shared status dot lab re-registered with them), presence on the avatar (and the shared avatar lab
   re-registered with it), AvatarGroup, Persona (profile summary), ProgressCircle, QRCode and VersionLabel. Each value with
   the one --plx-comp-* token behind it; the markup is what the components render. */
if (window.DS && DS.registerLab) {
  (function () {
    var STATIC = [['default', 'Default']];
    var CORNER = 'border-top-left-radius';
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (extraCls) { return extraCls ? ' ' + extraCls : ''; };
    var PRESENCE = [['online', 'Online'], ['away', 'Away'], ['busy', 'Busy'], ['dnd', 'Do not disturb'], ['offline', 'Offline']];
    var IS_PRESENCE = { online: 1, away: 1, busy: 1, dnd: 1, offline: 1 };
    var GLYPH = { online: 'check', away: 'clock', dnd: 'remove', offline: 'close-2' };   // busy: the solid dot, nothing cut out
    var AV_PX = { '2xs': 20, xs: 24, sm: 28, md: 32, lg: 40, xl: 48, '2xl': 64 };
    var DOT_OF = { 20: 'sm', 24: 'sm', 28: 'sm', 32: 'sm', 40: 'md', 48: 'md', 64: 'lg' };

    // ---- a status dot as StatusDot draws it (tone, size, glyph)
    var SD = function (n) { return 'plx-comp-status-dot-' + n; };
    var dotHtml = function (tone, size, glyph, cls) {
      var g = glyph && size !== 'sm' && GLYPH[tone];
      return '<span class="plx-status-dot plx-status-dot--' + tone + (size !== 'sm' ? ' plx-status-dot--' + size : '') + (g ? ' plx-status-dot--glyph' : '') + ex(cls) + '" aria-hidden="true">'
        + (g ? DS.icon(GLYPH[tone], 'plx-status-dot__glyph') : '') + '</span>';
    };

    // ---- Availability indicator (<StatusDot tone="online|away|busy|dnd|offline" size icon>)
    DS.registerLab('availability-indicator', {
      name: 'Availability indicator', title: 'Plenix availability indicator', file: 'platform/components/StatusDot/status-dot.css', compPrefix: /^plx-comp-status-dot-/,
      store: 'plenix-availability-indicator-lab-tokens',
      sizes: [['sm', 'Sm (6px, default)', '.plx-status-dot'], ['md', 'Md (12px)', '.plx-status-dot--md'], ['lg', 'Lg (16px)', '.plx-status-dot--lg']],
      variants: PRESENCE, states: STATIC,
      content: [['dot', 'The dot'], ['glyph', 'With its glyph (md and lg)']],
      labels: { size: 'Size', variant: 'Availability', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'online', state: 'default', content: 'glyph' },
      props: [
        { id: 'bg', label: 'Color', css: ['background-color'], cat: 'color' },
        { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'icon' },
        { id: 'h', label: 'Height', css: ['block-size'], show: 'height', cat: 'icon' },
        { id: 'rad', label: 'Corner radius', css: [CORNER], cat: 'radius' },
        { id: 'gc', label: 'Glyph color', css: ['color'], cat: 'color' },
        { id: 'gs', label: 'Glyph box', css: ['inline-size'], show: 'width', cat: 'icon', part: '.plx-status-dot__glyph' }
      ],
      token: function (id, size, variant, state, content) {
        var big = size !== 'sm', glyph = content === 'glyph' && big && !!GLYPH[variant];
        switch (id) {
          case 'bg': return SD(variant + '-background');
          case 'w': return big ? SD(size + '-size') : SD('width');
          case 'h': return big ? SD(size + '-size') : SD('height');
          case 'rad': return SD('radius');
          case 'gc': return glyph ? SD('glyph-color') : null;
          case 'gs': return glyph ? SD(size + '-size') : null;
          default: return null;
        }
      },
      reach: function (full) { var m = /status-dot-(online|away|busy|dnd|offline)-/.exec(full); return m ? 'every ' + (m[1] === 'dnd' ? 'do not disturb' : m[1]) + ' dot' : /status-dot-(md|lg)-/.test(full) ? 'every larger status dot' : 'every status dot'; },
      every: 'every status dot',
      html: function (variant, size, state, extraCls, ui) { return dotHtml(variant, size, ui && ui.content === 'glyph', extraCls); },
      labelSelector: null,
      parts: { bg: 'A', rad: 'A', w: 'B', h: 'B', gc: 'C', gs: 'C' },
      anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'right' }, C: { part: null, side: 'bottom' } },
      sections: [['Dot', ['bg', 'w', 'h', 'rad']], ['Glyph', ['gc', 'gs']]],
      matrixLabel: 'Availability dot values by state',
      statesHead: 'Availabilities · ' + HEAD
    });
    // the shared status dot lab (display-labs.js) with the availability tones beside the feedback tones
    var SDL = DS.labs['status-dot'];
    if (SDL) {
      DS.registerLab('status-dot', Object.assign({}, SDL, { variants: SDL.variants.concat(PRESENCE),
        reach: function (full) { var m = /status-dot-(online|away|busy|dnd|offline)-/.exec(full); return m ? 'every ' + (m[1] === 'dnd' ? 'do not disturb' : m[1]) + ' dot' : SDL.reach(full); } }));
    }

    // ---- Presence (<Avatar presence>): the ringed dot at the avatar's bottom end corner
    var AV = function (n) { return 'plx-comp-avatar-' + n; };
    var presenceHtml = function (variant, size, extraCls, own) {
      var px = AV_PX[size], dot = DOT_OF[px];
      return '<span class="plx-avatar plx-avatar--' + px + ' plx-avatar--presence' + ex(extraCls) + '" data-plx-avatar=""' + (own ? ' data-plx-color="purple"' : '') + ' aria-hidden="true">MC'
        + dotHtml(variant, dot, dot !== 'sm', 'plx-avatar__presence') + '</span>';
    };
    var PRESENCE_PROPS = [
      { id: 'pbg', label: 'Dot color', css: ['background-color'], cat: 'color', part: '.plx-avatar__presence' },
      { id: 'psz', label: 'Dot size', css: ['inline-size'], show: 'width', cat: 'icon', part: '.plx-avatar__presence' },
      { id: 'prc', label: 'Ring color', css: ['border-top-color'], cat: 'color', part: '.plx-avatar__presence' },
      { id: 'prw', label: 'Ring width', css: ['border-top-width'], cat: 'border-width', part: '.plx-avatar__presence' },
      { id: 'pof', label: 'Offset past the corner', css: ['inset-block-end'], show: 'bottom', cat: 'space', part: '.plx-avatar__presence' }
    ];
    var presenceToken = function (id, size, variant) {
      if (!IS_PRESENCE[variant]) return null;
      var dot = DOT_OF[AV_PX[size]];
      switch (id) {
        case 'pbg': return SD(variant + '-background');
        case 'psz': return dot === 'sm' ? SD('width') : SD(dot + '-size');
        case 'prc': return AV('presence-ring-color');
        case 'prw': return AV('presence-ring-width');
        case 'pof': return AV('presence-offset');
        case 'aw': return AV(AV_PX[size] + '-width');
        default: return null;
      }
    };
    var AV_SIZES = [['2xs', '2XS (20px)', '.plx-avatar--20'], ['xs', 'XS (24px)', '.plx-avatar--24'], ['sm', 'SM (28px)', '.plx-avatar--28'], ['md', 'MD (32px)', '.plx-avatar--32'],
      ['lg', 'LG (40px)', '.plx-avatar--40'], ['xl', 'XL (48px)', '.plx-avatar--48'], ['2xl', '2XL (64px)', '.plx-avatar--64']];
    DS.registerLab('presence', {
      name: 'Presence', title: 'Plenix presence on the avatar', file: 'platform/components/Avatar/avatar.css', compPrefix: /^plx-comp-(avatar-presence|status-dot)-/,
      store: 'plenix-presence-lab-tokens', sizes: AV_SIZES, variants: PRESENCE, states: STATIC, content: [['initials', 'Initials (MC)']],
      labels: { size: 'Avatar size', variant: 'Presence', state: 'State', content: 'Content' },
      defaults: { size: 'xl', variant: 'online', state: 'default', content: 'initials' },
      props: PRESENCE_PROPS.concat([{ id: 'aw', label: 'Avatar width', css: ['inline-size'], show: 'width', cat: 'size' }]),
      token: presenceToken,
      reach: function (full) { return /avatar-presence-/.test(full) ? 'every presence dot on an avatar' : /status-dot-/.test(full) ? 'every status dot of that kind' : 'every avatar of that size'; },
      every: 'every presence dot',
      html: function (variant, size, state, extraCls) { return presenceHtml(variant, size, extraCls, false); },
      labelSelector: null,
      parts: { pbg: 'A', psz: 'A', prc: 'B', prw: 'B', pof: 'C', aw: 'D' },
      anchors: { A: { part: '.plx-avatar__presence', side: 'right' }, B: { part: '.plx-avatar__presence', side: 'bottom' }, C: { part: '.plx-avatar__presence', side: 'left' }, D: { part: null, side: 'top' } },
      sections: [['Dot', ['pbg', 'psz']], ['Ring', ['prc', 'prw', 'pof']], ['Avatar', ['aw']]],
      matrixLabel: 'Presence values by state',
      statesHead: 'Presence · ' + HEAD
    });
    // the shared avatar lab (content-labs.js) with presence beside the color variants
    var AVL = DS.labs.avatar;
    if (AVL) {
      DS.registerLab('avatar', Object.assign({}, AVL, {
        variants: AVL.variants.concat(PRESENCE.map(function (p) { return [p[0], 'With presence: ' + p[1]]; })),
        props: AVL.props.concat(PRESENCE_PROPS),
        token: function (id, size, variant, state, content) {
          if (PRESENCE_PROPS.some(function (p) { return p.id === id; })) return presenceToken(id, size, variant);
          return AVL.token(id, size, IS_PRESENCE[variant] ? 'theme' : variant, state, content);
        },
        html: function (variant, size, state, extraCls, ui) { return IS_PRESENCE[variant] ? presenceHtml(variant, size, extraCls, false) : AVL.html(variant, size, state, extraCls, ui); },
        parts: Object.assign({}, AVL.parts, { pbg: 'P', psz: 'P', prc: 'P', prw: 'P', pof: 'P' }),
        anchors: Object.assign({}, AVL.anchors, { P: { part: '.plx-avatar__presence', side: 'right' } }),
        sections: (AVL.sections || []).concat([['Presence', ['pbg', 'psz', 'prc', 'prw', 'pof']]]),
        reach: function (full) { return /avatar-presence-|status-dot-/.test(full) ? 'every presence dot' : AVL.reach(full); }
      }));
    }

    // ---- Avatar group (<AvatarGroup layout size max>): avatars, then the +N tile
    var AG = function (n) { return 'plx-comp-avatar-group-' + n; };
    var AG_PX = { xs: 24, sm: 28, md: 32, lg: 40 };
    var AG_PEOPLE = [['MC', 'online'], ['AK', 'away'], ['SO', 'busy'], ['AS', 'offline'], ['LR', 'online']];
    DS.registerLab('avatar-group', {
      name: 'Avatar group', title: 'Plenix avatar group', file: 'platform/components/AvatarGroup/avatar-group.css', compPrefix: /^plx-comp-avatar-group-/,
      store: 'plenix-avatar-group-lab-tokens',
      sizes: [['xs', 'XS (24px)', '.plx-avatar-group--xs'], ['sm', 'SM (28px, default)', '.plx-avatar-group--sm'], ['md', 'MD (32px)', '.plx-avatar-group--md'], ['lg', 'LG (40px)', '.plx-avatar-group--lg']],
      variants: [['stack', 'Stack (default)'], ['grid', 'Grid']], states: STATIC,
      content: [['overflow', 'Five people, max 3 (+2)'], ['all', 'Three people'], ['presence', 'Four people with presence']],
      labels: { size: 'Size', variant: 'Layout', state: 'State', content: 'People' },
      defaults: { size: 'sm', variant: 'stack', state: 'default', content: 'overflow' },
      props: [
        { id: 'ring', label: 'Ring (stack)', css: ['box-shadow'], cat: 'shadow', part: '.plx-avatar-group__avatar' },
        { id: 'ov', label: 'Overlap (stack)', css: ['margin-inline-start'], show: 'margin-left', cat: 'space', part: '.plx-avatar-group__avatar:nth-child(2)' },
        { id: 'gap', label: 'Gap (grid)', css: ['column-gap'], cat: 'space' },
        { id: 'aw', label: 'Avatar size', css: ['inline-size'], show: 'width', cat: 'size', part: '.plx-avatar-group__avatar' },
        { id: 'mbg', label: '+N fill', css: ['background-color'], cat: 'color', part: '.plx-avatar-group__more' },
        { id: 'mfg', label: '+N count color', css: ['color'], cat: 'color', part: '.plx-avatar-group__more' },
        { id: 'mff', label: '+N count face', css: ['font-family'], cat: 'font', part: '.plx-avatar-group__more' }
      ],
      token: function (id, size, variant, state, content) {
        var stack = variant === 'stack', more = content === 'overflow';
        switch (id) {
          case 'ring': return stack ? AG('ring') : null;
          case 'ov': return stack ? AG(size + '-overlap') : null;
          case 'gap': return stack ? null : AG('gap');
          case 'aw': return 'plx-comp-avatar-' + AG_PX[size] + '-width';
          case 'mbg': return more ? AG('more-background') : null;
          case 'mfg': return more ? AG('more-text') : null;
          case 'mff': return more ? AG('more-font-family') : null;
          default: return null;
        }
      },
      reach: function (full) { var m = /avatar-group-(xs|sm|md|lg)-/.exec(full); return m ? 'every avatar group of that size' : 'every avatar group'; },
      every: 'every avatar group',
      html: function (variant, size, state, extraCls, ui) {
        var px = AG_PX[size], content = (ui && ui.content) || 'overflow';
        var people = content === 'all' ? AG_PEOPLE.slice(0, 3) : content === 'presence' ? AG_PEOPLE.slice(0, 4) : AG_PEOPLE.slice(0, 3);
        var dot = DOT_OF[px];
        var avatars = people.map(function (p) {
          return '<span class="plx-avatar plx-avatar--' + px + (content === 'presence' ? ' plx-avatar--presence' : '') + ' plx-avatar-group__avatar" data-plx-avatar="" role="img" aria-label="' + p[0] + '">' + p[0]
            + (content === 'presence' ? dotHtml(p[1], dot, dot !== 'sm', 'plx-avatar__presence') : '') + '</span>';
        }).join('');
        var more = content === 'overflow' ? '<span class="plx-avatar plx-avatar--' + px + ' plx-avatar-group__more" data-plx-avatar="" role="img" aria-label="2 more">+2</span>' : '';
        return '<div class="plx-avatar-group plx-avatar-group--' + variant + ' plx-avatar-group--' + size + ex(extraCls) + '" role="group" aria-label="Collaborators">' + avatars + more + '</div>';
      },
      labelSelector: null,
      parts: { ring: 'A', ov: 'A', gap: 'A', aw: 'B', mbg: 'C', mfg: 'C', mff: 'C' },
      anchors: { A: { part: '.plx-avatar-group__avatar', side: 'top' }, B: { part: '.plx-avatar-group__avatar', side: 'left' }, C: { part: '.plx-avatar-group__more', side: 'right' } },
      sections: [['Layout', ['ring', 'ov', 'gap', 'aw']], ['+N tile', ['mbg', 'mfg', 'mff']]],
      matrixLabel: 'Avatar group values by layout',
      statesHead: 'Layouts · ' + HEAD
    });

    // ---- Profile summary (<Persona size>): the avatar, the name (and a role badge) over one detail
    var PS = function (n) { return 'plx-comp-persona-' + n; };
    var PS_PX = { xs: 24, sm: 28, md: 32, lg: 40, xl: 48 };
    DS.registerLab('profile-summary', {
      name: 'Profile summary', title: 'Plenix profile summary (Persona)', file: 'platform/components/Persona/persona.css', compPrefix: /^plx-comp-persona-/,
      store: 'plenix-profile-summary-lab-tokens',
      sizes: [['xs', 'XS (24px avatar)', '.plx-persona--xs'], ['sm', 'SM (28px)', '.plx-persona--sm'], ['md', 'MD (32px, default)', '.plx-persona--md'], ['lg', 'LG (40px)', '.plx-persona--lg'], ['xl', 'XL (48px)', '.plx-persona--xl']],
      variants: [['name', 'Name only'], ['secondary', 'Name and detail'], ['presence', 'With presence'], ['role', 'With role']], states: STATIC,
      content: [['person', 'Maya Chen, Designer']],
      labels: { size: 'Size', variant: 'Content', state: 'State', content: 'Person' },
      defaults: { size: 'md', variant: 'secondary', state: 'default', content: 'person' },
      props: [
        { id: 'gap', label: 'Gap after the avatar', css: ['column-gap'], cat: 'space' },
        { id: 'aw', label: 'Avatar size', css: ['inline-size'], show: 'width', cat: 'size', part: '.plx-persona__avatar' },
        { id: 'nc', label: 'Name color', css: ['color'], cat: 'color', part: '.plx-persona__name' },
        { id: 'nfs', label: 'Name size', css: ['font-size'], cat: 'font-size', part: '.plx-persona__name' },
        { id: 'nfw', label: 'Name weight', css: ['font-weight'], cat: 'font-weight', part: '.plx-persona__name' },
        { id: 'lh', label: 'Line height', css: ['line-height'], cat: 'line-height', part: '.plx-persona__name' },
        { id: 'sc', label: 'Detail color', css: ['color'], cat: 'color', part: '.plx-persona__secondary' },
        { id: 'sfs', label: 'Detail size', css: ['font-size'], cat: 'font-size', part: '.plx-persona__secondary' },
        { id: 'rg', label: 'Gap before the role', css: ['column-gap'], cat: 'space', part: '.plx-persona__primary' }
      ],
      token: function (id, size, variant) {
        var detail = variant !== 'name';
        switch (id) {
          case 'gap': return PS(size + '-gap');
          case 'aw': return 'plx-comp-avatar-' + PS_PX[size] + '-width';
          case 'nc': return PS('name-color');
          case 'nfs': return PS(size + '-name-font-size');
          case 'nfw': return PS('name-font-weight');
          case 'lh': return PS('line-height');
          case 'sc': return detail ? PS('secondary-color') : null;
          case 'sfs': return detail ? PS(size + '-secondary-font-size') : null;
          case 'rg': return variant === 'role' ? PS('role-gap') : null;
          default: return null;
        }
      },
      reach: function (full) { var m = /persona-(xs|sm|md|lg|xl)-/.exec(full); return m ? 'every profile summary at ' + m[1].toUpperCase() : 'every profile summary'; },
      every: 'every profile summary',
      html: function (variant, size, state, extraCls) {
        var px = PS_PX[size], dot = DOT_OF[px], pres = variant === 'presence';
        return '<div class="plx-persona plx-persona--' + size + ex(extraCls) + '">'
          + '<span class="plx-avatar plx-avatar--' + px + (pres ? ' plx-avatar--presence' : '') + ' plx-persona__avatar" data-plx-avatar="" aria-hidden="true">MC' + (pres ? dotHtml('online', dot, dot !== 'sm', 'plx-avatar__presence') : '') + '</span>'
          + '<div class="plx-persona__text"><div class="plx-persona__primary"><span class="plx-persona__name">Maya Chen</span>'
          + (pres ? '<span class="plx-visually-hidden">, Online</span>' : '')
          + (variant === 'role' ? '<span class="plx-badge plx-badge--neutral plx-badge--sm plx-persona__role">Owner</span>' : '') + '</div>'
          + (variant !== 'name' ? '<div class="plx-persona__secondary">Designer · Brand team</div>' : '') + '</div></div>';
      },
      labelSelector: '.plx-persona__name',
      parts: { gap: 'A', aw: 'A', nc: 'B', nfs: 'B', nfw: 'B', lh: 'B', rg: 'B', sc: 'C', sfs: 'C' },
      anchors: { A: { part: '.plx-persona__avatar', side: 'left' }, B: { part: '.plx-persona__name', side: 'top' }, C: { part: '.plx-persona__secondary', side: 'bottom' } },
      sections: [['Layout', ['gap', 'aw', 'rg']], ['Name', ['nc', 'nfs', 'nfw', 'lh']], ['Detail', ['sc', 'sfs']]],
      matrixLabel: 'Profile summary values by content',
      statesHead: 'Contents · ' + HEAD
    });

    // ---- Circular progress (<ProgressCircle size tone value showValue>): the ring in SVG
    var PC = function (n) { return 'plx-comp-progress-circle-' + n; };
    var ARC_62 = 'M 24 3 A 21 21 0 1 1 9.62 39.31';   // ProgressCircle's arc for 62%
    DS.registerLab('circular-progress', {
      name: 'Circular progress', title: 'Plenix circular progress', file: 'platform/components/ProgressCircle/progress-circle.css', compPrefix: /^plx-comp-progress-circle-/,
      store: 'plenix-circular-progress-lab-tokens',
      sizes: [['sm', 'SM (16px)', '.plx-progress-circle--sm'], ['md', 'MD (24px, default)', '.plx-progress-circle--md'], ['lg', 'LG (48px)', '.plx-progress-circle--lg']],
      variants: [['info', 'Info (default)'], ['success', 'Success'], ['warning', 'Warning'], ['danger', 'Danger'], ['neutral', 'Neutral']], states: STATIC,
      content: [['known', 'A known amount (62%)'], ['value', 'With the value (lg)'], ['unknown', 'Unknown (indeterminate)']],
      labels: { size: 'Size', variant: 'Tone', state: 'State', content: 'Amount' },
      defaults: { size: 'lg', variant: 'info', state: 'default', content: 'value' },
      props: [
        { id: 'box', label: 'Size', css: ['inline-size'], show: 'width', cat: 'icon' },
        { id: 'tc', label: 'Track color', css: ['stroke'], cat: 'color', part: '.plx-progress-circle__track' },
        { id: 'ac', label: 'Arc color', css: ['stroke'], cat: 'color', part: '.plx-progress-circle__indicator' },
        { id: 'sw', label: 'Stroke width', css: ['stroke-width'], cat: 'border-width', part: '.plx-progress-circle__track' },
        { id: 'vc', label: 'Value color', css: ['color'], cat: 'color', part: '.plx-progress-circle__value' },
        { id: 'vff', label: 'Value face', css: ['font-family'], cat: 'font', part: '.plx-progress-circle__value' },
        { id: 'vfs', label: 'Value size', css: ['font-size'], cat: 'font-size', part: '.plx-progress-circle__value' },
        { id: 'vlh', label: 'Value line height', css: ['line-height'], cat: 'line-height', part: '.plx-progress-circle__value' }
      ],
      token: function (id, size, variant, state, content) {
        var value = content === 'value' && size === 'lg';
        switch (id) {
          case 'box': return PC(size + '-size');
          case 'tc': return PC('track-color');
          case 'ac': return PC(variant + '-color');
          case 'sw': return PC(size + '-stroke-width');
          case 'vc': return value ? PC('value-color') : null;
          case 'vff': return value ? PC('value-font-family') : null;
          case 'vfs': return value ? PC('value-font-size') : null;
          case 'vlh': return value ? PC('value-line-height') : null;
          default: return null;
        }
      },
      reach: function (full) { var m = /progress-circle-(info|success|warning|danger|neutral)-/.exec(full); return m ? 'every ' + m[1] + ' ring' : /progress-circle-(sm|md|lg)-/.test(full) ? 'every ring of that size' : 'every circular progress'; },
      every: 'every circular progress',
      html: function (variant, size, state, extraCls, ui) {
        var content = (ui && ui.content) || 'known', unknown = content === 'unknown', value = content === 'value' && size === 'lg';
        return '<span class="plx-progress-circle plx-progress-circle--' + size + ' plx-progress-circle--' + variant + (unknown ? ' is-indeterminate' : '') + ex(extraCls) + '" role="progressbar" aria-label="Uploading 3 files"'
          + (unknown ? '' : ' aria-valuemin="0" aria-valuemax="100" aria-valuenow="62"') + '>'
          + '<svg class="plx-progress-circle__svg" viewBox="0 0 48 48" focusable="false" aria-hidden="true"><circle class="plx-progress-circle__track" cx="24" cy="24" r="21"></circle>'
          + '<path class="plx-progress-circle__indicator" d="' + (unknown ? 'M 24 3 A 21 21 0 0 1 45 24' : ARC_62) + '"></path></svg>'
          + (value ? '<span class="plx-progress-circle__value" aria-hidden="true">62%</span>' : '') + '</span>';
      },
      labelSelector: '.plx-progress-circle__value',
      parts: { box: 'A', tc: 'B', sw: 'B', ac: 'C', vc: 'D', vff: 'D', vfs: 'D', vlh: 'D' },
      anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-progress-circle__track', side: 'left' }, C: { part: '.plx-progress-circle__indicator', side: 'right' }, D: { part: '.plx-progress-circle__value', side: 'bottom' } },
      sections: [['Ring', ['box', 'tc', 'ac', 'sw']], ['Value', ['vc', 'vff', 'vfs', 'vlh']]],
      matrixLabel: 'Circular progress values by tone',
      statesHead: 'Tones · ' + HEAD
    });

    // ---- QR code (<QRCode size level logo caption showValue onAccent>): the matrix from qrEncode, as QRCode draws it
    var QR = function (n) { return 'plx-comp-qr-code-' + n; };
    var QR_VALUE = 'https://plenix.lighthouseway.org/notes/';
    var qrPath = function (level, logo) {
      var enc = window.Plenix && window.Plenix.qrEncode;
      if (!enc) return { d: '', box: 29 };
      var code = enc(QR_VALUE, { level: logo ? 'H' : level }), n = code.size, clear = 0;
      if (logo) { clear = Math.round(n * 0.25); if (clear % 2 === 0) clear++; }
      var lo = (n - clear) / 2, hi = lo + clear, out = [];
      for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
        if (!code.modules[y][x] || (clear && x >= lo && x < hi && y >= lo && y < hi)) continue;
        out.push('M' + (x + 4) + ' ' + (y + 4) + 'h1v1h-1z');
      }
      return { d: out.join(''), box: n + 8 };
    };
    DS.registerLab('qr-code', {
      name: 'QR code', title: 'Plenix QR code', file: 'platform/components/QRCode/qr-code.css', compPrefix: /^plx-comp-qr-code-/,
      store: 'plenix-qr-code-lab-tokens',
      sizes: [['sm', 'SM (96px)', '.plx-qr-code--sm'], ['md', 'MD (160px, default)', '.plx-qr-code--md'], ['lg', 'LG (240px)', '.plx-qr-code--lg']],
      variants: [['page', 'On the page (default)'], ['on-accent', 'On accent']], states: STATIC,
      content: [['m', 'Level M (default)'], ['l', 'Level L'], ['q', 'Level Q'], ['h', 'Level H'], ['caption', 'With caption and value'], ['logo', 'With logo space']],
      labels: { size: 'Size', variant: 'Surface', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'page', state: 'default', content: 'caption' },
      props: [
        { id: 'plate', label: 'Plate color', css: ['background-color'], cat: 'color', part: '.plx-qr-code__svg' },
        { id: 'mod', label: 'Module color', css: ['fill'], cat: 'color', part: '.plx-qr-code__modules' },
        { id: 'prad', label: 'Plate corners', css: [CORNER], cat: 'radius', part: '.plx-qr-code__svg' },
        { id: 'fsz', label: 'Code size (quiet zone included)', css: ['inline-size'], show: 'width', cat: 'size', part: '.plx-qr-code__frame' },
        { id: 'lsz', label: 'Logo box', css: ['inline-size'], show: 'width', cat: 'icon', part: '.plx-qr-code__logo' },
        { id: 'gap', label: 'Gap (code to caption)', css: ['row-gap'], cat: 'space' },
        { id: 'cc', label: 'Caption color', css: ['color'], cat: 'color', part: '.plx-qr-code__text' },
        { id: 'cfs', label: 'Caption size', css: ['font-size'], cat: 'font-size', part: '.plx-qr-code__text' },
        { id: 'vc', label: 'Value color', css: ['color'], cat: 'color', part: '.plx-qr-code__value' },
        { id: 'vff', label: 'Value face', css: ['font-family'], cat: 'font', part: '.plx-qr-code__value' },
        { id: 'vfs', label: 'Value size', css: ['font-size'], cat: 'font-size', part: '.plx-qr-code__value' }
      ],
      token: function (id, size, variant, state, content) {
        var cap = content === 'caption', acc = variant === 'on-accent';
        switch (id) {
          case 'plate': return QR('plate-color');
          case 'mod': return QR('module-color');
          case 'prad': return QR('plate-radius');
          case 'fsz': return QR(size + '-size');
          case 'lsz': return content === 'logo' ? QR(size + '-logo-size') : null;
          case 'gap': return cap ? QR('caption-gap') : null;
          case 'cc': return cap ? QR(acc ? 'on-accent-caption-color' : 'caption-color') : null;
          case 'cfs': return cap ? QR('caption-font-size') : null;
          case 'vc': return cap ? QR(acc ? 'on-accent-value-color' : 'value-color') : null;
          case 'vff': return cap ? QR('value-font-family') : null;
          case 'vfs': return cap ? QR('value-font-size') : null;
          default: return null;
        }
      },
      reach: function (full) { return /qr-code-(sm|md|lg)-/.test(full) ? 'every QR code of that size' : /on-accent/.test(full) ? 'every QR code on accent' : 'every QR code'; },
      every: 'every QR code',
      html: function (variant, size, state, extraCls, ui) {
        var content = (ui && ui.content) || 'm', logo = content === 'logo', cap = content === 'caption';
        var level = { l: 'L', q: 'Q', h: 'H' }[content] || 'M', p = qrPath(level, logo);
        var out = '<figure class="plx-qr-code plx-qr-code--' + size + (variant === 'on-accent' ? ' plx-qr-code--on-accent' : '') + ex(extraCls) + '"><span class="plx-qr-code__frame">'
          + '<svg class="plx-qr-code__svg" viewBox="0 0 ' + p.box + ' ' + p.box + '" role="img" aria-label="QR code: open Notes on your phone" focusable="false"><path class="plx-qr-code__modules" d="' + p.d + '"></path></svg>'
          + (logo ? '<span class="plx-qr-code__logo"><span aria-hidden="true" class="plx-brand-mark plx-brand-mark--size-md"></span></span>' : '') + '</span>'
          + (cap ? '<figcaption class="plx-qr-code__caption"><span class="plx-qr-code__text">Scan to open Notes on your phone</span><span class="plx-qr-code__value">' + QR_VALUE + '</span></figcaption>' : '') + '</figure>';
        return variant === 'on-accent' ? '<div class="ds-w04b-accent">' + out + '</div>' : out;
      },
      labelSelector: '.plx-qr-code__text',
      parts: { plate: 'A', prad: 'A', fsz: 'A', mod: 'B', lsz: 'C', gap: 'D', cc: 'D', cfs: 'D', vc: 'E', vff: 'E', vfs: 'E' },
      anchors: { A: { part: '.plx-qr-code__svg', side: 'left' }, B: { part: '.plx-qr-code__modules', side: 'top' }, C: { part: '.plx-qr-code__frame', side: 'right' }, D: { part: '.plx-qr-code__text', side: 'left' }, E: { part: '.plx-qr-code__value', side: 'bottom' } },
      sections: [['Code', ['plate', 'mod', 'prad', 'fsz', 'lsz']], ['Caption', ['gap', 'cc', 'cfs', 'vc', 'vff', 'vfs']]],
      matrixLabel: 'QR code values by surface',
      statesHead: 'Surfaces · ' + HEAD
    });

    // ---- Version label (<VersionLabel version status size>): the number in the data font, then the qualifier
    var VL = function (n) { return 'plx-comp-version-label-' + n; };
    DS.registerLab('version-label', {
      name: 'Version label', title: 'Plenix version label', file: 'platform/components/VersionLabel/version-label.css', compPrefix: /^plx-comp-version-label-/,
      store: 'plenix-version-label-lab-tokens',
      sizes: [['md', 'Md (default)', '.plx-version-label--md'], ['sm', 'Sm (compact)', '.plx-version-label--sm']],
      variants: [['number', 'Number (v12)'], ['semver', 'Semantic version (2.1.0)'], ['latest', 'Latest'], ['draft', 'Draft']], states: STATIC,
      content: [['label', 'The label']],
      labels: { size: 'Size', variant: 'Format and qualifier', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'latest', state: 'default', content: 'label' },
      props: [
        { id: 'c', label: 'Number color', css: ['color'], cat: 'color', part: '.plx-version-label__number' },
        { id: 'ff', label: 'Number face', css: ['font-family'], cat: 'font', part: '.plx-version-label__number' },
        { id: 'fs', label: 'Number size', css: ['font-size'], cat: 'font-size', part: '.plx-version-label__number' },
        { id: 'lh', label: 'Line height', css: ['line-height'], cat: 'line-height', part: '.plx-version-label__number' },
        { id: 'gap', label: 'Gap before the qualifier', css: ['column-gap'], cat: 'space' }
      ],
      token: function (id, size, variant) {
        switch (id) {
          case 'c': return VL('color');
          case 'ff': return VL('font-family');
          case 'fs': return VL(size + '-font-size');
          case 'lh': return VL('line-height');
          case 'gap': return variant === 'latest' || variant === 'draft' ? VL('gap') : null;
          default: return null;
        }
      },
      reach: function (full) { return /version-label-(md|sm)-/.test(full) ? 'every version label of that size' : 'every version label'; },
      every: 'every version label',
      html: function (variant, size, state, extraCls) {
        var num = variant === 'semver' ? '2.1.0' : '<span aria-hidden="true">v</span>12';
        var badge = variant === 'latest' || variant === 'draft' ? '<span class="plx-badge plx-badge--neutral' + (size === 'sm' ? ' plx-badge--sm' : '') + ' plx-version-label__status">' + (variant === 'latest' ? 'Latest' : 'Draft') + '</span>' : '';
        return '<span class="plx-version-label plx-version-label--' + size + ex(extraCls) + '"><span class="plx-version-label__number"><span class="plx-visually-hidden">Version </span>' + num + '</span>' + badge + '</span>';
      },
      labelSelector: '.plx-version-label__number',
      parts: { c: 'A', ff: 'A', fs: 'A', lh: 'A', gap: 'B' },
      anchors: { A: { part: '.plx-version-label__number', side: 'top' }, B: { part: '.plx-version-label__status', side: 'right' } },
      sections: [['Number', ['c', 'ff', 'fs', 'lh']], ['Qualifier', ['gap']]],
      matrixLabel: 'Version label values by format',
      statesHead: 'Formats · ' + HEAD
    });
  })();
}
