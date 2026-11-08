### Added

- `EntityHeader` `media` takes `{ versus: [party, party], decorative }` (new type `EntityHeaderParty` = `{ name, src?, color? }`): two Avatars side by side, with a "vs." mark between them, as tall as the single media (initials without a picture, never a person icon). By default the pair is one image named "A versus B"; `decorative` hides it when the title already says it. Stretched layouts show the pair at the small size. The pair mirrors in right to left. New strings `entityHeader.vs` and `entityHeader.versus`, and tokens `entity-header-versus-*` (ADR 0037, D-0119, D-0122, #991).
