### Added

- `AppHeader` and `AppHeader.Switcher` take `brand={{ logo, organization, application }}` (new type `AppHeaderBrand`): the default brand's layout with the app's own logo (36px tall, up to 108px wide, no box, not drawn if it fails; `alt` defaults to empty), organization (where "Plenix" is) and application (default: the app name). Long lines end in an ellipsis. With `brandHref` it is one link; as the switcher trigger its name is the organization and application. An element `brand` is unchanged (ADR 0039, D-0125, D-0127, #997).
