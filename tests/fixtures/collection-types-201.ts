import { useCollectionView, CollectionField } from '../../release/packages/react';
const fields: CollectionField<{ name: string; size: number }>[] = [{ value: 'name', label: 'Name', get: row => row.name }];
const view = useCollectionView(fields, { data: [{ name: 'A', size: 1 }], text: row => row.name, quick: { name: 'list' }, view: { height: 'short' } });
view.test({ name: 'B', size: 2 });
view.quickProps('name').counts?.get('A');
view.setSearch(previous => previous + 'a');
view.setSort([{ field: 'name', dir: 'asc' }]);
// @ts-expect-error wrong row shape
view.test({ name: 3, size: 2 });
// @ts-expect-error invalid sort direction
view.setSort([{ field: 'name', dir: 'up' }]);
// @ts-expect-error invalid row height
view.setView({ layout: 'list', size: 'm', height: 'huge' });
// @ts-expect-error text callback must return a string
useCollectionView(fields, { text: row => row.size });
