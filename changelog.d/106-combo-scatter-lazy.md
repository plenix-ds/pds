### Changed

- ComboChart and ScatterChart load their code the first time one is drawn, as the other ECharts charts do (#106, #553). A chart's "Show the data" grid is drawn when it is first opened (and kept), not with the closed chart.

### Fixed

- A chart that loads on first use no longer logs React's "state update on a component that hasn't mounted yet" warning from its data grid (the grid mounted inside the lazy boundary while closed).
