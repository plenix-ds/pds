### Fixed

- AppShell `frame="centered"`: a Drawer opens from the frame's edge (its backdrop still covers the window) and the Toast region stays inside the frame, not on the grey sides. A Dialog is unchanged, and `frame="full"` draws as before (#877).
