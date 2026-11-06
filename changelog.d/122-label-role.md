### Changed

- Four parts now draw the whole label role (#122, Phase 4): the command menu's page title, the search popup's title, the combobox's group heading and the focus order overlay's numbers. Their letter-spacing and line-height (label role: normal, 1.5) were inherited from whatever was around them; they are now set. Where the surrounding text had other values the lines may shift by a pixel or two. New tokens: `command-menu-page-title`, `search-popup-title` and `combobox-group` `-letter-spacing` and `-line-height`, and `focus-order-letter-spacing` and `-line-height`.
