// Library part w12A (wave 12, lane A): files and assets. FileList (a list, a table or a sortable list of files),
// FileBrowser (folders, breadcrumbs, the tree, a list or a grid), UploadManager (a panel or a dialog of uploads, with
// useUploadQueue) and VersionCompare (two versions side by side, with a slider, or as a text diff). MediaCard's asset and
// collection parts are in Card.tsx (already public).
export { FileList } from '../patterns/FileList/FileList.tsx';
export { sortFiles } from '../patterns/FileList/sortFiles.ts';
export { FileBrowser } from '../patterns/FileBrowser/FileBrowser.tsx';
export { UploadManager, useUploadQueue } from '../patterns/UploadManager/UploadManager.tsx';
export { VersionCompare, diffLines } from '../patterns/VersionCompare/VersionCompare.tsx';
