/* Plenix · sortFiles
   Summary: The order FileList and FileBrowser show files in, as a function you can call on its own: folders first, then the field, then the name.
     It is its own module (ADR 0052), so calling it loads none of the list's drawing code.
   Usage:
     sortFiles(files, { field: 'size', dir: 'desc' })
   Props:
     files: the files and folders (ListedFile: { id, name, kind: "file" | "folder", size (bytes), count (a folder's items), modified ("YYYY-MM-DD" or a Date), owner }); it is not changed
     sort: { field: "name" | "size" | "modified" | "owner", dir: "asc" | "desc" } (default { field: "name", dir: "asc" })
   Behavior:
     Returns a new array. Folders always come first, whichever way the field sorts. Names compare as people read them: case and accents do not count, and numbers count by value
       ("file2" before "file10"). A folder's size is its count of items. Equal values fall back to the name.
*/
const stamp = (v: any) => (v instanceof Date ? v.toISOString() : String(v || ''));

// the order of the list: folders first, then the field, then the name
export function sortFiles(files: any, sort: any) {
  const s = Object.assign({ field: 'name', dir: 'asc' }, sort);
  const sign = s.dir === 'desc' ? -1 : 1;
  const byName = (a: any, b: any) => String(a.name || '').localeCompare(String(b.name || ''), undefined, { numeric: true, sensitivity: 'base' });
  const by = (a: any, b: any) => {
    if (s.field === 'size') return (a.kind === 'folder' ? a.count || 0 : Number(a.size) || 0) - (b.kind === 'folder' ? b.count || 0 : Number(b.size) || 0);
    if (s.field === 'modified') return stamp(a.modified).localeCompare(stamp(b.modified));
    if (s.field === 'owner') return String(a.owner || '').localeCompare(String(b.owner || ''));
    return byName(a, b);
  };
  return files.slice().sort((a: any, b: any) => {
    const fa = a.kind === 'folder' ? 0 : 1, fb = b.kind === 'folder' ? 0 : 1;
    if (fa !== fb) return fa - fb;
    return sign * by(a, b) || byName(a, b);
  });
}
