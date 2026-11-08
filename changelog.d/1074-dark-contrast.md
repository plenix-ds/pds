### Fixed

- Dark mode: the `Cascader` placeholder reads `content-muted` (it was 3.04:1 on the dark surface), and a plain `DataPill` keeps the category's text color in light and the content color in dark, where the category's dark text would not read (new token `category-plain-amount`, ref `mix-amount-full`). Found by the story axe run (#1074).
