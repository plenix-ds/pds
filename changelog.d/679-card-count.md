### Added
- DataGrid's card count can name the app's records (#679): `strings={{ cardCount: { one: '{n} member', other: '{n} members' } }}` makes "6 records" read "6 members", in the locale's plural forms (Arabic gives zero, one, two, few, many and other). Without it the count is unchanged.
