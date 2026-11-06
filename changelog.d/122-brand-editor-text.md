### Changed

- The brand lockup's name and application name and the image editor's text overlay take their whole text role (#122, Phase 4). The lockup parts now set their own size (from the size variant, through a new `brand-font-size` hook token) and letter spacing, and the wordmark's weight comes from the heading role (same value); the editor text sets the body role's letter spacing and line height. Nothing looks different (the computed text is unchanged for every size, kind and tone, in both directions, and in the Asset Manager's editor). Four parts leave the text-role backlog.
