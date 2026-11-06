### Changed

- BoxPlot draws with Apache ECharts (owner decision 2026-10-26, #106) and loads on first use: same name, props, tooltip and "Show the data"; the box and whiskers are a box plot series, the median line and the pointer areas the frame's overlay (the median keeps its own token), the outliers a scatter series. A whisker's cap is now as wide as the box (it was half). `boxStats` stays in the first load. The vendored engine grows 2.5 KB gzipped (198.6 KB).
