### Changed

- TypeScript wave 2 (#618, ADR 0011): `Diagram`, `NetworkGraph` and `SankeyDiagram` are now `.tsx` with exported prop types (`DiagramProps`, `DiagramNode`, `DiagramEdge` and `DiagramGroup`; `NetworkGraphProps`, `NetworkNode`, `NetworkEdge` and `NetworkGroup`; `SankeyDiagramProps`, `SankeyNode` and `SankeyLink`). No `any` in a public prop; the chart frame's own props are reused. No behavior change.
