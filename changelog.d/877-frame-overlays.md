### Fixed

- AppShell `frame="centered"`: a Drawer opens from the frame's edge, not the window's, and the toasts stay inside the frame; the Dialog is unchanged and every backdrop still covers the whole window. While the shell is framed it sets `--plx-state-frame-width` on the page root, which the Drawer layer and the toast region read (#877, D-0093).
