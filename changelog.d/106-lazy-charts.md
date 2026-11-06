### Changed

- The ECharts charts (LineChart, AreaChart, BarChart, PieChart, TreeChart and Sparkline) load their code the first time one is drawn, not in the first load: the whole bundle is 1,418 KB, down from 1,445 KB (#106). Names, props and behavior are the same; `pieSlices`, `binValues` and `gridRoom` stay available at once.
