# Plenix pills and color values

The owner’s revised 70-color palette has 12 families; see [Palette](palette.md) for every canonical color, transparent token and deprecated alias. The owner approved the remaining category mappings and retired Brown in favor of Orange.

## Pill rule

Use the existing soft fill, soft border and on-soft text roles; radius 4px. Statuses use semantic roles. There are 19 active categories. Brown is a deprecated alias of Orange for one release; existing Brown data uses Orange. Components read system roles, never hex values. Orange means action required; Yellow means waiting; Brown reference shades remain available; Brown is no longer a category.

## Semantic pills

| Variant | Light fill | Light border | Light text | Contrast |
|---|---|---|---|---|
| Neutral | `{plx-ref.color-gray-100}` `#f3f3f3` | `{plx-ref.color-gray-300}` `#d0d0d0` | `{plx-ref.color-gray-700}` `#56585e` | 6.41 |
| Success | `{plx-ref.color-green-100}` `#dff6dd` | `{plx-ref.color-green-300}` `#58ad58` | `{plx-ref.color-green-700}` `#1b5e0c` | 6.92 |
| Active | `{plx-ref.color-blue-100}` `#ebf0f7` | `{plx-ref.color-blue-300}` `#a2c0e3` | `{plx-ref.color-blue-700}` `#005a9e` | 6.20 |
| Waiting | `{plx-ref.color-yellow-100}` `#fff8df` | `{plx-ref.color-yellow-300}` `#e8c34a` | `{plx-ref.color-brown-600}` `#765600` | 6.37 |
| Action required | `{plx-ref.color-orange-100}` `#fff0e3` | `{plx-ref.color-orange-300}` `#f2ad70` | `{plx-ref.color-brown-500}` `#963f00` | 6.26 |
| Negative | `{plx-ref.color-red-100}` `#fde7e7` | `{plx-ref.color-red-300}` `#e96060` | `{plx-ref.color-red-800}` `#990000` | 7.54 |

## Categories — light

| Category | Base | Soft | Border | Text | Text contrast |
|---|---|---|---|---|---|
| red | `{plx-ref.color-red-500}` `#f60000` | `{plx-ref.color-red-100}` `#fde7e7` | `{plx-ref.color-red-200}` `#f8aca2` | `{plx-ref.color-red-800}` `#990000` | 7.54 |
| green | `{plx-ref.color-green-300}` `#58ad58` | `{plx-ref.color-green-100}` `#dff6dd` | `{plx-ref.color-green-200}` `#9bd39b` | `{plx-ref.color-green-700}` `#1b5e0c` | 6.92 |
| yellow | `{plx-ref.color-yellow-150}` `#ffe119` | `{plx-ref.color-yellow-100}` `#fff8df` | `{plx-ref.color-yellow-300}` `#e8c34a` | `{plx-ref.color-brown-600}` `#765600` | 6.37 |
| blue | `{plx-ref.color-blue-400}` `#2a6fdb` | `{plx-ref.color-blue-100}` `#ebf0f7` | `{plx-ref.color-blue-300}` `#a2c0e3` | `{plx-ref.color-blue-700}` `#005a9e` | 6.20 |
| orange | `{plx-ref.color-orange-500}` `#d96800` | `{plx-ref.color-orange-100}` `#fff0e3` | `{plx-ref.color-orange-300}` `#f2ad70` | `{plx-ref.color-brown-700}` `#7a3400` | 8.12 |
| purple | `{plx-ref.color-purple-500}` `#911eb4` | `{plx-ref.color-purple-100}` `#f6f0fe` | `{plx-ref.color-purple-300}` `#d7aefb` | `{plx-ref.color-purple-700}` `#6a2e7f` | 8.14 |
| cyan | `{plx-ref.color-cyan-300}` `#6bddf8` | `{plx-ref.color-cyan-100}` `#e2f8fe` | `{plx-ref.color-cyan-700}` `#045766` | `{plx-ref.color-cyan-700}` `#045766` | 7.46 |
| magenta | `{plx-ref.color-magenta-500}` `#f032e6` | `{plx-ref.color-magenta-100}` `#ffedfc` | `{plx-ref.color-magenta-300}` `#f4b0ec` | `{plx-ref.color-magenta-700}` `#752870` | 8.18 |
| lime | `{plx-ref.color-yellow-150}` `#ffe119` | `{plx-ref.color-green-100}` `#dff6dd` | `{plx-ref.color-green-200}` `#9bd39b` | `{plx-ref.color-green-700}` `#1b5e0c` | 6.92 |
| pink | `{plx-ref.color-pink-300}` `#f3b7cd` | `{plx-ref.color-pink-100}` `#ffeef4` | `{plx-ref.color-pink-700}` `#6c3b4f` | `{plx-ref.color-pink-700}` `#6c3b4f` | 7.91 |
| teal | `{plx-ref.color-teal-500}` `#469990` | `{plx-ref.color-teal-100}` `#dafcf7` | `{plx-ref.color-teal-300}` `#8adcd2` | `{plx-ref.color-teal-700}` `#065a53` | 7.42 |
| lavender | `{plx-ref.color-purple-300}` `#d7aefb` | `{plx-ref.color-purple-100}` `#f6f0fe` | `{plx-ref.color-purple-500}` `#911eb4` | `{plx-ref.color-purple-700}` `#6a2e7f` | 8.14 |
| beige | `{plx-ref.color-yellow-100}` `#fff8df` | `{plx-ref.color-yellow-100}` `#fff8df` | `{plx-ref.color-orange-200}` `#f8d0ad` | `{plx-ref.color-brown-600}` `#765600` | 6.37 |
| maroon | `{plx-ref.color-red-800}` `#990000` | `{plx-ref.color-red-100}` `#fde7e7` | `{plx-ref.color-red-200}` `#f8aca2` | `{plx-ref.color-red-800}` `#990000` | 7.54 |
| mint | `{plx-ref.color-green-100}` `#dff6dd` | `{plx-ref.color-green-100}` `#dff6dd` | `{plx-ref.color-green-200}` `#9bd39b` | `{plx-ref.color-green-700}` `#1b5e0c` | 6.92 |
| olive | `{plx-ref.color-green-500}` `#107c10` | `{plx-ref.color-yellow-100}` `#fff8df` | `{plx-ref.color-orange-200}` `#f8d0ad` | `{plx-ref.color-brown-600}` `#765600` | 6.37 |
| apricot | `{plx-ref.color-orange-200}` `#f8d0ad` | `{plx-ref.color-orange-100}` `#fff0e3` | `{plx-ref.color-orange-300}` `#f2ad70` | `{plx-ref.color-brown-700}` `#7a3400` | 8.12 |
| navy | `{plx-ref.color-blue-950}` `#000075` | `{plx-ref.color-blue-100}` `#ebf0f7` | `{plx-ref.color-blue-300}` `#a2c0e3` | `{plx-ref.color-blue-700}` `#005a9e` | 6.20 |
| gray | `{plx-ref.color-gray-400}` `#a3a6ad` | `{plx-ref.color-gray-100}` `#f3f3f3` | `{plx-ref.color-gray-300}` `#d0d0d0` | `{plx-ref.color-gray-700}` `#56585e` | 6.41 |

## Categories — dark

| Category | Base | Soft | Border | Text | Text contrast |
|---|---|---|---|---|---|
| red | `{plx-ref.color-red-500}` `#f60000` | `{plx-ref.color-red-100}` `#fde7e7` | `{plx-ref.color-red-200}` `#f8aca2` | `{plx-ref.color-red-800}` `#990000` | 7.54 |
| green | `{plx-ref.color-green-300}` `#58ad58` | `{plx-ref.color-green-100}` `#dff6dd` | `{plx-ref.color-green-200}` `#9bd39b` | `{plx-ref.color-green-700}` `#1b5e0c` | 6.92 |
| yellow | `{plx-ref.color-yellow-150}` `#ffe119` | `{plx-ref.color-yellow-100}` `#fff8df` | `{plx-ref.color-yellow-300}` `#e8c34a` | `{plx-ref.color-brown-600}` `#765600` | 6.37 |
| blue | `{plx-ref.color-blue-400}` `#2a6fdb` | `{plx-ref.color-blue-100}` `#ebf0f7` | `{plx-ref.color-blue-300}` `#a2c0e3` | `{plx-ref.color-blue-700}` `#005a9e` | 6.20 |
| orange | `{plx-ref.color-orange-500}` `#d96800` | `{plx-ref.color-orange-100}` `#fff0e3` | `{plx-ref.color-orange-300}` `#f2ad70` | `{plx-ref.color-brown-700}` `#7a3400` | 8.12 |
| purple | `{plx-ref.color-purple-500}` `#911eb4` | `{plx-ref.color-purple-100}` `#f6f0fe` | `{plx-ref.color-purple-300}` `#d7aefb` | `{plx-ref.color-purple-700}` `#6a2e7f` | 8.14 |
| cyan | `{plx-ref.color-cyan-300}` `#6bddf8` | `{plx-ref.color-cyan-100}` `#e2f8fe` | `{plx-ref.color-cyan-700}` `#045766` | `{plx-ref.color-cyan-700}` `#045766` | 7.46 |
| magenta | `{plx-ref.color-magenta-500}` `#f032e6` | `{plx-ref.color-magenta-100}` `#ffedfc` | `{plx-ref.color-magenta-300}` `#f4b0ec` | `{plx-ref.color-magenta-700}` `#752870` | 8.18 |
| lime | `{plx-ref.color-yellow-150}` `#ffe119` | `{plx-ref.color-green-100}` `#dff6dd` | `{plx-ref.color-green-200}` `#9bd39b` | `{plx-ref.color-green-700}` `#1b5e0c` | 6.92 |
| pink | `{plx-ref.color-pink-300}` `#f3b7cd` | `{plx-ref.color-pink-100}` `#ffeef4` | `{plx-ref.color-pink-700}` `#6c3b4f` | `{plx-ref.color-pink-700}` `#6c3b4f` | 7.91 |
| teal | `{plx-ref.color-teal-500}` `#469990` | `{plx-ref.color-teal-100}` `#dafcf7` | `{plx-ref.color-teal-300}` `#8adcd2` | `{plx-ref.color-teal-700}` `#065a53` | 7.42 |
| lavender | `{plx-ref.color-purple-300}` `#d7aefb` | `{plx-ref.color-purple-100}` `#f6f0fe` | `{plx-ref.color-purple-500}` `#911eb4` | `{plx-ref.color-purple-700}` `#6a2e7f` | 8.14 |
| beige | `{plx-ref.color-yellow-100}` `#fff8df` | `{plx-ref.color-yellow-100}` `#fff8df` | `{plx-ref.color-orange-200}` `#f8d0ad` | `{plx-ref.color-brown-600}` `#765600` | 6.37 |
| maroon | `{plx-ref.color-red-800}` `#990000` | `{plx-ref.color-red-100}` `#fde7e7` | `{plx-ref.color-red-200}` `#f8aca2` | `{plx-ref.color-red-800}` `#990000` | 7.54 |
| mint | `{plx-ref.color-green-100}` `#dff6dd` | `{plx-ref.color-green-100}` `#dff6dd` | `{plx-ref.color-green-200}` `#9bd39b` | `{plx-ref.color-green-700}` `#1b5e0c` | 6.92 |
| olive | `{plx-ref.color-green-500}` `#107c10` | `{plx-ref.color-yellow-100}` `#fff8df` | `{plx-ref.color-orange-200}` `#f8d0ad` | `{plx-ref.color-brown-600}` `#765600` | 6.37 |
| apricot | `{plx-ref.color-orange-200}` `#f8d0ad` | `{plx-ref.color-orange-100}` `#fff0e3` | `{plx-ref.color-orange-300}` `#f2ad70` | `{plx-ref.color-brown-700}` `#7a3400` | 8.12 |
| navy | `{plx-ref.color-blue-950}` `#000075` | `{plx-ref.color-blue-100}` `#ebf0f7` | `{plx-ref.color-blue-300}` `#a2c0e3` | `{plx-ref.color-blue-700}` `#005a9e` | 6.20 |
| gray | `{plx-ref.color-gray-400}` `#a3a6ad` | `{plx-ref.color-gray-100}` `#f3f3f3` | `{plx-ref.color-gray-300}` `#d0d0d0` | `{plx-ref.color-gray-700}` `#56585e` | 6.41 |

## Owner decisions

Brown is retired: its system roles alias Orange for one release and it is omitted from the category pickers. Lime and Yellow share their base, as approved. Blue’s base becomes the primary brand blue; Cyan, Pink and Lavender borders use the next darker same-family shade, distinct from their bases. Olive’s base becomes Green 500, and Beige’s border becomes Orange 200. No alternate mapping has been invented.

| Mode | Channel | Categories | Final color |
|---|---|---|---|
| light | base | yellow, lime | #ffe119 |
| light | -soft | red, maroon | #fde7e7 |
| light | -soft | green, lime, mint | #dff6dd |
| light | -soft | yellow, beige, olive | #fff8df |
| light | -soft | blue, navy | #ebf0f7 |
| light | -soft | orange, apricot | #fff0e3 |
| light | -soft | purple, lavender | #f6f0fe |
| light | -soft-border | red, maroon | #f8aca2 |
| light | -soft-border | green, lime, mint | #9bd39b |
| light | -soft-border | blue, navy | #a2c0e3 |
| light | -soft-border | orange, apricot | #f2ad70 |
| light | -soft-border | beige, olive | #f8d0ad |
| light | -on-soft | red, maroon | #990000 |
| light | -on-soft | green, lime, mint | #1b5e0c |
| light | -on-soft | yellow, beige, olive | #765600 |
| light | -on-soft | blue, navy | #005a9e |
| light | -on-soft | orange, apricot | #7a3400 |
| light | -on-soft | purple, lavender | #6a2e7f |
| dark | base | yellow, lime | #ffe119 |
| dark | -soft | red, maroon | #fde7e7 |
| dark | -soft | green, lime, mint | #dff6dd |
| dark | -soft | yellow, beige, olive | #fff8df |
| dark | -soft | blue, navy | #ebf0f7 |
| dark | -soft | orange, apricot | #fff0e3 |
| dark | -soft | purple, lavender | #f6f0fe |
| dark | -soft-border | red, maroon | #f8aca2 |
| dark | -soft-border | green, lime, mint | #9bd39b |
| dark | -soft-border | blue, navy | #a2c0e3 |
| dark | -soft-border | orange, apricot | #f2ad70 |
| dark | -soft-border | beige, olive | #f8d0ad |
| dark | -on-soft | red, maroon | #990000 |
| dark | -on-soft | green, lime, mint | #1b5e0c |
| dark | -on-soft | yellow, beige, olive | #765600 |
| dark | -on-soft | blue, navy | #005a9e |
| dark | -on-soft | orange, apricot | #7a3400 |
| dark | -on-soft | purple, lavender | #6a2e7f |

## Category border rule

A category border never equals its base. When their resolved colors coincide after migration, use the next darker canonical shade in the same family. Keep on-soft text contrast at least 4.5:1.

| Mode | Category | Border before → after | Final color |
|---|---|---|---|
| light | cyan | {plx-ref.color-cyan-300} → {plx-ref.color-cyan-700} | #045766 |
| light | pink | {plx-ref.color-pink-300} → {plx-ref.color-pink-700} | #6c3b4f |
| light | lavender | {plx-ref.color-purple-300} → {plx-ref.color-purple-500} | #911eb4 |
| dark | cyan | {plx-ref.color-cyan-300} → {plx-ref.color-cyan-700} | #045766 |
| dark | pink | {plx-ref.color-pink-300} → {plx-ref.color-pink-700} | #6c3b4f |
| dark | lavender | {plx-ref.color-purple-300} → {plx-ref.color-purple-500} | #911eb4 |
