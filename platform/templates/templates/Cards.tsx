import { ContentGrid } from '../../patterns/ContentGrid/ContentGrid.tsx';
import { FeatureCard } from '../../patterns/FeatureCard/FeatureCard.tsx';
import FolderIcon from 'plenix-platform/icons/plenix/folder';
export function Cards({ items = [], onOpen }: any) { return <ContentGrid>{items.map((item: any) => <FeatureCard key={item.id} title={item.title} description={item.description} icon={item.icon || FolderIcon} href={item.href} onOpen={!item.href && onOpen ? () => onOpen(item) : undefined} />)}</ContentGrid>; }
