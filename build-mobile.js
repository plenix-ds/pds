// Plenix · build-mobile.js (batch 297; Plenix Platforms Standard 7.2): the token outputs native apps use, GENERATED from
// the tokens (never edit the outputs by hand):
//   platform/mobile/ios/PlenixTokens.swift        SwiftUI: theme colors (light and dark), DM Sans / Reddit Mono, radius,
//                                                 spacing, and the iOS size and behavior set (platform-ios.tokens.json)
//   platform/mobile/android/PlenixTokens.kt       Jetpack Compose: the same theme values and the Android set
//                                                 (platform-android.tokens.json)
//   platform/mobile/flutter/plenix_tokens.dart    Flutter: a ThemeExtension with the theme values, and the iOS and Android
//                                                 sets chosen by defaultTargetPlatform (a Flutter web build uses the web set)
// Theme values are the Default theme's at the standard density (tokens.index.json, resolved); a theme is written once and
// applies to every platform (1.5). Run by build-app.js; alone: node build-mobile.js
const fs = require('fs');
const path = require('path');
const { css } = require('./tools/token-value.js');   // a $value as text: the W3C typed values too (#872)

const camel = (s) => s.replace(/^--plx-(sys|ref|comp)-/, '').replace(/-([a-z0-9])/g, (m, c) => c.toUpperCase());
const pascal = (s) => { const c = camel(s); return c.charAt(0).toUpperCase() + c.slice(1); };
const hex8 = (v) => {   // #rgb, #rrggbb, #rrggbbaa -> AARRGGBB (or null)
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(String(v).trim()); if (!m) return null;
  let h = m[1]; if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const a = h.length === 8 ? h.slice(6) : 'ff'; return (a + h.slice(0, 6)).toUpperCase();
};
const px = (v) => { const s = String(v).trim(); let m; if ((m = /^(-?[\d.]+)px$/.exec(s))) return +m[1]; if ((m = /^(-?[\d.]+)rem$/.exec(s))) return +m[1] * 16; return null; };

module.exports = function buildMobile(root) {
  const T = path.join(root, 'platform', 'tokens');
  const index = JSON.parse(fs.readFileSync(path.join(T, 'tokens.index.json'), 'utf8')).tokens;
  const at = (t, mode) => (t.resolved.all !== undefined ? t.resolved.all : t.resolved[mode + '/standard']);
  // the theme: every semantic color (light and dark), the category and data colors among them; radius and spacing roles
  const colors = index.filter((t) => /^--plx-sys-/.test(t.name) && t.type === 'color').map((t) => ({ id: camel(t.name), light: hex8(at(t, 'light')), dark: hex8(at(t, 'dark')) })).filter((c) => c.light && c.dark);
  const sizes = (re) => index.filter((t) => re.test(t.name) && t.type === 'dimension').map((t) => ({ id: camel(t.name), v: px(at(t, 'light')) })).filter((x) => x.v !== null);
  const radius = sizes(/^--plx-sys-radius-/), space = sizes(/^--plx-sys-space-/);
  // batch 341: the other system scales native code needs (border widths, icon sizes, shapes; opacities; durations in
  // seconds), and the component tokens the native designs name (platform/standards/native-design.json), so native code
  // names a token for every value
  const nums = (re) => index.filter((t) => re.test(t.name) && t.type === 'number').map((t) => ({ id: camel(t.name), v: parseFloat(at(t, 'light')) })).filter((x) => !isNaN(x.v));
  const secs = (v) => { const s = String(v).trim(); let m; if ((m = /^([\d.]+)ms$/.exec(s))) return +m[1] / 1000; if ((m = /^([\d.]+)s$/.exec(s))) return +m[1]; return null; };
  const durs = (re) => index.filter((t) => re.test(t.name) && t.type === 'duration').map((t) => ({ id: camel(t.name), v: secs(at(t, 'light')) })).filter((x) => x.v !== null);
  const shell = sizes(/^--plx-sys-shell-/), border = sizes(/^--plx-sys-border-width-/), icon = sizes(/^--plx-sys-(icon-size|control-icon)-/), shape = sizes(/^--plx-sys-shape-/);
  const opacity = nums(/^--plx-sys-opacity-/), motion = durs(/^--plx-sys-motion-(duration|delay)-/);
  const designFile = path.join(root, 'platform', 'standards', 'native-design.json');
  const named = new Set(fs.existsSync(designFile) ? (fs.readFileSync(designFile, 'utf8').match(/plx-comp-[a-z0-9-]*[a-z0-9]/g) || []).map((n) => '--' + n) : []);
  const comp = index.filter((t) => named.has(t.name)).map((t) => { const v = at(t, 'light'); const d = px(v), n = parseFloat(v), sec = secs(v);
    return t.type === 'dimension' && d !== null ? { id: camel(t.name), kind: 'size', v: d } : t.type === 'duration' && sec !== null ? { id: camel(t.name), kind: 'sec', v: sec } : t.type === 'number' && !isNaN(n) ? { id: camel(t.name), kind: 'num', v: n } : null; }).filter(Boolean)
    .sort((a, b) => a.id.localeCompare(b.id));
  // the typefaces: the first family of --plx-sys-typeface-sans and -mono (the web's font stacks)
  const face = (name) => { const t = index.find((x) => x.name === name); const v = t && at(t, 'light'); const m = v && /^\s*"?([^",]+)"?/.exec(v); if (!m) throw new Error(name + ' has no typeface'); return m[1].trim(); };
  const SANS = face('--plx-sys-typeface-sans'), MONO = face('--plx-sys-typeface-mono');
  // the platform sets, flattened (plx-sys.control-target-min -> controlTargetMin, text.title.size -> textTitleSize): their
  // names are the web token names for the same role (Platforms Standard 7.1), so each constant keeps the web token it maps
  // to; a mapping to a token that does not exist stops the build
  const known = new Set(index.map((t) => t.name));
  const flat = (obj, pre, out, file) => { for (const k of Object.keys(obj)) { if (k.charAt(0) === '$') continue; const v = obj[k], seg = /^plx-/.test(k) ? '' : k, id = !seg ? pre : pre ? pre + '-' + seg : seg;
    if (v && v.$value !== undefined) {
      const p = (v.$extensions && v.$extensions.plenix) || {}, web = p.web && typeof p.web === 'object' ? p.web.token : p.web;
      if (web && !known.has(web)) throw new Error(file + ': ' + id + ' maps to ' + web + ', which is not a token');
      if (p.web && typeof p.web === 'object' && !/^plx-text--[a-z]+$/.test(p.web.class || '')) throw new Error(file + ': ' + id + ' names no text role');
      out.push({ id: id.replace(/-([a-z0-9])/g, (m, c) => c.toUpperCase()), value: css(v.$value), type: v.$type, desc: v.$description || '', src: p.source,
        web: p.web && typeof p.web === 'object' ? '.' + p.web.class + (web ? ' ' + web : '') : web || null });
    } else if (v && typeof v === 'object') flat(v, id, out, file); } return out; };
  const set = (f, key) => flat(JSON.parse(fs.readFileSync(path.join(T, f), 'utf8'))[key], '', [], f);
  const ios = set('platform-ios.tokens.json', 'plx-platform-ios'), android = set('platform-android.tokens.json', 'plx-platform-android');
  const num = (v) => parseFloat(String(v));
  const note = (x) => ' // ' + (x.web ? 'web ' + x.web : 'platform only') + (x.src ? '; ' + x.src.type + ': ' + x.src.name + (x.src.url ? ' (' + x.src.url + ')' : '') : x.desc ? '; ' + x.desc : '');
  const HEAD = (c) => c + ' GENERATED by build-mobile.js from platform/tokens (the Plenix Platforms Standard 7.2). Do not edit: edit the tokens and build.\n';
  const out = {};

  // SwiftUI
  out['ios/PlenixTokens.swift'] = HEAD('//') + `import SwiftUI

/// Plenix tokens for SwiftUI. Use native controls (Platforms Standard 1.4) and style them with these values.
public enum Plenix {
    /// A theme color with its light and dark values; follows the system appearance.
    public static func color(light: UInt32, dark: UInt32) -> Color {
        Color(UIColor { $0.userInterfaceStyle == .dark ? UIColor(argb: dark) : UIColor(argb: light) })
    }
    /// DM Sans and Reddit Mono, scaled with Dynamic Type through the text style they are relative to (3.4).
    public enum Font {
        public static let sans = "${SANS}" // web --plx-sys-typeface-sans
        public static let mono = "${MONO}" // web --plx-sys-typeface-mono
        public static func sans(_ size: CGFloat, relativeTo style: SwiftUI.Font.TextStyle) -> SwiftUI.Font { .custom(sans, size: size, relativeTo: style) }
        public static func mono(_ size: CGFloat, relativeTo style: SwiftUI.Font.TextStyle) -> SwiftUI.Font { .custom(mono, size: size, relativeTo: style) }
    }
    public enum Colors {
${colors.map((c) => `        public static let ${c.id} = Plenix.color(light: 0x${c.light}, dark: 0x${c.dark})`).join('\n')}
    }
    public enum Radius {
${radius.map((r) => `        public static let ${r.id}: CGFloat = ${r.v}`).join('\n')}
    }
    public enum Space {
${space.map((r) => `        public static let ${r.id}: CGFloat = ${r.v}`).join('\n')}
    }
    public enum Border {
${border.map((r) => `        public static let ${r.id}: CGFloat = ${r.v}`).join('\n')}
    }
    public enum Icon {
${icon.map((r) => `        public static let ${r.id}: CGFloat = ${r.v}`).join('\n')}
    }
    public enum Shape {
${shape.map((r) => `        public static let ${r.id}: CGFloat = ${r.v}`).join('\n')}
    }
    public enum Shell {
${shell.map((r) => `        public static let ${r.id}: CGFloat = ${r.v}`).join('\n')}
    }
    public enum Opacity {
${opacity.map((r) => `        public static let ${r.id}: Double = ${r.v}`).join('\n')}
    }
    /// Durations in seconds.
    public enum Motion {
${motion.map((r) => `        public static let ${r.id}: Double = ${r.v}`).join('\n')}
    }
    /// The component values the Plenix native designs use (sizes in points, durations in seconds).
    public enum Component {
${comp.map((r) => `        public static let ${r.id}: ${r.kind === 'size' ? 'CGFloat' : 'Double'} = ${r.v}`).join('\n')}
    }
    /// The iOS size and behavior set (platform-ios.tokens.json), in points.
    public enum Platform {
${ios.map((x) => x.type === 'dimension' ? `        public static let ${x.id}: CGFloat = ${num(x.value)}${note(x)}` : x.type === 'fontWeight' ? `        public static let ${x.id}: CGFloat = ${num(x.value)}${note(x)}` : `        public static let ${x.id} = ${JSON.stringify(x.value)}${note(x)}`).join('\n')}
    }
}

private extension UIColor {
    convenience init(argb: UInt32) {
        self.init(red: CGFloat((argb >> 16) & 0xFF) / 255, green: CGFloat((argb >> 8) & 0xFF) / 255, blue: CGFloat(argb & 0xFF) / 255, alpha: CGFloat((argb >> 24) & 0xFF) / 255)
    }
}
`;

  // Jetpack Compose
  out['android/PlenixTokens.kt'] = HEAD('//') + `package plenix.tokens

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/** Plenix tokens for Jetpack Compose. Use Material 3 components (Platforms Standard 1.4), themed with these values. */
object PlenixColors {
    /** A theme color with its light and dark values; follows the system appearance. */
    class Pair(val light: Color, val dark: Color) { @Composable fun current(): Color = if (isSystemInDarkTheme()) dark else light }
${colors.map((c) => `    val ${c.id} = Pair(Color(0x${c.light}), Color(0x${c.dark}))`).join('\n')}
}

object PlenixFonts { const val SANS = "${SANS}"; const val MONO = "${MONO}" } // web --plx-sys-typeface-sans, --plx-sys-typeface-mono

object PlenixRadius {
${radius.map((r) => `    val ${r.id} = ${r.v}.dp`).join('\n')}
}

object PlenixSpace {
${space.map((r) => `    val ${r.id} = ${r.v}.dp`).join('\n')}
}

object PlenixBorder {
${border.map((r) => `    val ${r.id} = ${r.v}.dp`).join('\n')}
}

object PlenixIcon {
${icon.map((r) => `    val ${r.id} = ${r.v}.dp`).join('\n')}
}

object PlenixShape {
${shape.map((r) => `    val ${r.id} = ${r.v}.dp`).join('\n')}
}

object PlenixShell {
${shell.map((r) => `    val ${r.id} = ${r.v}.dp`).join('\n')}
}

object PlenixOpacity {
${opacity.map((r) => `    const val ${r.id} = ${r.v}f`).join('\n')}
}

/** Durations in milliseconds. */
object PlenixMotion {
${motion.map((r) => `    const val ${r.id} = ${Math.round(r.v * 1000)}`).join('\n')}
}

/** The component values the Plenix native designs use (dp; durations in milliseconds). */
object PlenixComponent {
${comp.map((r) => r.kind === 'size' ? `    val ${r.id} = ${r.v}.dp` : r.kind === 'sec' ? `    const val ${r.id} = ${Math.round(r.v * 1000)}` : `    const val ${r.id} = ${r.v}f`).join('\n')}
}

/** The Android size and behavior set (platform-android.tokens.json): dp, and sp for type. */
object PlenixPlatform {
${android.map((x) => x.type === 'dimension' ? `    val ${x.id} = ${num(x.value)}.${/sp$/.test(x.value) ? 'sp' : 'dp'}${note(x)}` : x.type === 'fontWeight' ? `    const val ${x.id} = ${num(x.value)}${note(x)}` : `    const val ${x.id} = ${JSON.stringify(x.value)}${note(x)}`).join('\n')}
}
`;

  // Flutter
  const dartSet = (name, list) => `class ${name} {\n  const ${name}._();\n${list.map((x) => x.type === 'dimension' || x.type === 'fontWeight' ? `  static const double ${x.id} = ${num(x.value)};${note(x).replace(' //', ' //')}` : `  static const String ${x.id} = ${JSON.stringify(x.value)};${note(x)}`).join('\n')}\n}\n`;
  out['flutter/plenix_tokens.dart'] = HEAD('//') + `import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

/// Plenix tokens for Flutter: Cupertino widgets on iOS, Material widgets on Android (Platforms Standard 1.4).
/// Add PlenixTheme.light or PlenixTheme.dark to ThemeData.extensions; PlenixPlatform.ios or .android holds the
/// platform set (PlenixPlatform.current picks it by defaultTargetPlatform).
@immutable
class PlenixTheme extends ThemeExtension<PlenixTheme> {
${colors.map((c) => `  final Color ${c.id};`).join('\n')}
  const PlenixTheme({
${colors.map((c) => `    required this.${c.id},`).join('\n')}
  });
  static const light = PlenixTheme(
${colors.map((c) => `    ${c.id}: Color(0x${c.light}),`).join('\n')}
  );
  static const dark = PlenixTheme(
${colors.map((c) => `    ${c.id}: Color(0x${c.dark}),`).join('\n')}
  );
  static const String fontSans = '${SANS}'; // web --plx-sys-typeface-sans
  static const String fontMono = '${MONO}'; // web --plx-sys-typeface-mono
  @override
  PlenixTheme copyWith() => this;
  @override
  PlenixTheme lerp(ThemeExtension<PlenixTheme>? other, double t) => (other is PlenixTheme && t >= 0.5) ? other : this;
}

class PlenixRadius {
  const PlenixRadius._();
${radius.map((r) => `  static const double ${r.id} = ${r.v};`).join('\n')}
}

class PlenixSpace {
  const PlenixSpace._();
${space.map((r) => `  static const double ${r.id} = ${r.v};`).join('\n')}
}

${dartSet('PlenixIos', ios)}
${dartSet('PlenixAndroid', android)}
class PlenixPlatform {
  const PlenixPlatform._();
  /// iOS on Apple platforms, Android otherwise (a Flutter web build uses the web Platform's set).
  static bool get isApple => defaultTargetPlatform == TargetPlatform.iOS || defaultTargetPlatform == TargetPlatform.macOS;
  /// The smallest touch target on this platform (3.1).
  static double get targetMin => isApple ? PlenixIos.controlTargetMin : PlenixAndroid.controlTargetMin;
}
`;
  // Android Views read sizes from resources, not Kotlin: the same values as <dimen> (plx_<group>_<name>)
  const snake = (id) => id.replace(/([A-Z])/g, (m, c) => '_' + c.toLowerCase()).replace(/([a-z])([0-9])/g, '$1_$2');
  const dimGroups = [['radius', radius], ['space', space], ['border', border], ['icon', icon], ['shape', shape], ['shell', shell], ['component', comp.filter((r) => r.kind === 'size')]];
  out['android/res/values/plenix_dimens.xml'] = '<?xml version="1.0" encoding="utf-8"?>\n<!--' + HEAD('').replace("\\n", '') + ' -->\n<resources>\n'
    + dimGroups.map(([g, list]) => list.map((r) => '    <dimen name="plx_' + g + '_' + snake(r.id) + '">' + r.v + 'dp</dimen>').join('\n')).join('\n')
    + '\n' + android.filter((x) => x.type === 'dimension').map((x) => '    <dimen name="plx_platform_' + snake(x.id) + '">' + num(x.value) + (/sp$/.test(x.value) ? 'sp' : 'dp') + '</dimen>').join('\n') + '\n</resources>\n';
  let changed = 0;
  for (const [f, text] of Object.entries(out)) {
    const p = path.join(root, 'platform', 'mobile', f);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== text) { fs.writeFileSync(p, text); changed++; }
  }
  return { files: Object.keys(out), colors: colors.length, ios: ios.length, android: android.length, changed };
};

if (require.main === module) { const r = module.exports(__dirname); console.log('Wrote platform/mobile: ' + r.files.join(', ') + ' (' + r.colors + ' colors, iOS ' + r.ios + ' and Android ' + r.android + ' platform values' + (r.changed ? '' : ', unchanged') + ')'); }
