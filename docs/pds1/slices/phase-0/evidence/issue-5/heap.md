# Issue 5: spec heap (tools/agent/spec-heap.js 64, forced GC, MB)
- Before: start 24.0, peak 62.6 (layout/grid), end 46.0 (growth line over 64 routes: 0.34/route).
- After DS.mount: start 23.5, peak 51.1, end 30.4-30.6 (0.11/route).
- Left: the foundation pages that embed audit/lab iframes still hold about 3 MB each until a page without a frame is opened (heap drops at layout/stack). Not found yet.
