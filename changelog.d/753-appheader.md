### Changed

- AppHeader is written in TypeScript with typed props for AppHeader and its statics (Item, Account, Action and Switcher). The new exported types are AppHeaderProps, AppHeaderItemProps, AppHeaderAccountProps, AppHeaderAccountStrings, AppHeaderActionProps, AppHeaderSwitcherProps, AppHeaderLink, AppHeaderBack and AppHeaderOpenApp. AppHeader.Action's `variant` is marked deprecated in the types because it has no effect (batch 272). No behavior change (#753 wave 3, #61, ADR 0011).
