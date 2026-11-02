/* Plenix · RenditionList
   Summary: Stored derivatives with format and byte size, as a DataGrid or a menu of downloads.
   Usage: <RenditionList items={renditions} variant="table"/>
   Props: items: [{id,name,format,size,href,fileName,onDownload,progress}]; variant: table | menu;
     strings: label,name,format,size,download,empty; className.
   Behavior: Each action downloads the specific stored rendition; busy downloads cannot repeat.
   Notes: Links retain browser download behavior. File preparation belongs to the caller.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { cx } from '../../utils/cx.ts';
import { DataGrid } from '../../components/DataGrid/DataGrid.jsx';
import { DownloadButton } from '../../components/DownloadButton/DownloadButton.tsx';
import { Menu,MenuItem } from '../../components/Menu/Menu.tsx';
import { formatBytes } from '../../utils/format.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import DownloadTrayIcon from 'plenix-platform/icons/plenix/download-tray';
export function RenditionList({items=[],variant='table',strings,className}){
  devWarn('RenditionList', { variant }, { variant: ['table','menu'] });
 const t=useStrings('renditionList', strings);
 const download=r=><DownloadButton href={r.href} fileName={r.fileName||r.name} format={r.format} size={r.size} onDownload={r.onDownload} progress={r.progress} strings={{download:t.download}} disabled={!r.href&&!r.onDownload}/>;
 if(!items.length)return <Text className={cx('plx-rendition-list',className)}>{t.empty}</Text>;
 return <Stack className={cx('plx-rendition-list',className)}>{variant==='menu'?<Menu label={t.label} trigger={<Button icon={DownloadTrayIcon}>{t.label}</Button>}>{items.map(r=><MenuItem className="plx-rendition-list__item" key={r.id} disabled={r.progress!==undefined||(!r.href&&!r.onDownload)} href={r.href} download={r.fileName||r.name} onSelect={r.onDownload}>{[r.name,r.format,typeof r.size==='number'?formatBytes(r.size):''].filter(Boolean).join(' · ')}</MenuItem>)}</Menu>:<DataGrid label={t.label} data={items} columns={[{field:'name',title:t.name,kind:'data'},{field:'format',title:t.format,kind:'data'},{field:'size',title:t.size,kind:'data',render:r=>typeof r.size==='number'?formatBytes(r.size):''},{field:'_download',title:t.download,kind:'center',render:download}]} />}</Stack>;
}
