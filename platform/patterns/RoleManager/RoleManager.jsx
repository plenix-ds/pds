/* Plenix · RoleManager
   Summary: The roles of a workspace and what each allows, in two views (10 Patterns › Authentication and permissions ›
     Roles). The roles list: each role by its name, the one sentence of what it can do, and how many people hold it,
     with Create role. The role detail: the role (its RoleLabel and description), its permissions (a built-in role's as a
     summary of what it can and cannot do; a custom role's as checkboxes by group), and its members, with Add a member
     (AssignControl), Remove, Duplicate (DuplicateAction) and, for a custom role, Delete (DeleteFlow). A role that must
     keep a member (the owner) cannot lose its last one.
   Usage:
     <RoleManager label="Roles" roles={roles} permissions={PERMISSIONS} people={people} onChange={setRoles} />
     <RoleManager roles={roles} permissions={PERMISSIONS} people={people} view="detail" roleId="editor"
       onViewChange={(view, id) => route(view, id)} onChange={setRoles} />
   Props:
     roles: the roles, in order: [{ id, name, description, builtIn, category, permissions, members, required }]
     roles[].builtIn: "owner" | "editor" | "viewer" for a built-in role (its RoleLabel; its permissions cannot change);
       leave it out for a custom role
     roles[].category: a custom role's category color (RoleLabel's category)
     roles[].permissions: the ids of the permissions the role allows
     roles[].members: the values of the people who hold it (people[].value)
     roles[].required: the role always keeps at least one member (the owner): its last member cannot be removed
     permissions: every permission, in order: [{ id, label, group, description }]; groups keep the order they first appear in
     people: the people of the workspace: EntityPicker's options ([{ value, label, description, src }])
     onChange(roles, change): the new list of roles after every change; change says what happened: { type: "create" |
       "duplicate" | "delete" | "permissions" | "add-member" | "remove-member", role, person }
     view: "list" | "detail" (controlled); roleId: the role the detail shows; onViewChange(view, roleId) runs on every move
     defaultView, defaultRoleId: the first view when the page does not control it (default "list")
     readOnly: the roles and members show without any change (people who cannot manage roles)
     label: the roles list's name (default strings.roles)
     headingLevel: the level of the detail's title (default 2; its sections one below)
     strings: the words, for other languages: { roles: "Roles", create: "Create role", createTitle: "Create role", name:
       "Name", description: "Description", descriptionHint: "One sentence on what people with this role can do.",
       startFrom: "Start with the permissions of", empty: "Enter a name.", taken: "A role named {name} already exists.",
       back: "All roles", members: "Members", member: "member", membersCount: "{n} members", memberCount: "{n} member",
       builtIn: "Built-in", custom: "Custom", permissions: "Permissions", builtInNote: "Built-in roles can’t be changed.
       Duplicate one to make your own.", addMember: "Add a member", remove: "Remove {name}", lastMember: "{role} needs at
       least one member. Add someone else first.", noMembers: "Nobody has this role yet.", role: "role", cancel: "Cancel", delete: "Delete",
       added: "{name} added to {role}", removed: "{name} removed from {role}", created: "{name} created",
       access: "People with the {role} role", people: "{n} people", peopleOne: "{n} person", allowed: "{permission} allowed for
       {role}", denied: "{permission} no longer allowed for {role}" }
     className: more classes on the manager
   Behavior:
     The list is a ResourceList: a role's name opens its detail; All roles goes back. Focus moves to the detail's title
       when it opens and back to the role's name when the list returns.
     A custom role's permission checkboxes save at once (onChange) and are announced; a built-in role shows the
       PermissionSummary of its permissions.
     Removing the last member of a required role does nothing but say why, in a notice above the members.
     Create role asks for a name (unique, not empty) and the role to start from; the new role opens.
   Notes:
     Few roles that match real jobs (Viewer, Editor, Owner) and custom roles only when needed. Every change should go
       to the workspace's audit log (onChange's change says what to record).
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { around } from '../../utils/fillNodes.tsx';
import { useUid } from '../../utils/layer.ts';
import { announce } from '../../utils/announce.tsx';
import { formatNumber } from '../../utils/format.ts';
import { Button } from '../../components/Button/Button.tsx';
import { Checkbox, RadioGroup } from '../../components/Checkbox/Checkbox.tsx';
import { Dialog } from '../../components/Dialog/Dialog.jsx';
import { Field } from '../../components/Field/Field.tsx';
import { Fieldset } from '../../components/Fieldset/Fieldset.tsx';
import { Icon } from '../../components/Icon/Icon.tsx';
import { Input, Textarea } from '../../components/Input/Input.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { RoleLabel } from '../../components/RoleLabel/RoleLabel.jsx';
import { Text } from '../../components/Text/Text.tsx';
import { ResourceList } from '../ResourceList/ResourceList.jsx';
import { PermissionSummary } from '../PermissionSummary/PermissionSummary.jsx';
import { AssignControl } from '../AssignControl/AssignControl.jsx';
import { DuplicateAction } from '../DuplicateAction/DuplicateAction.jsx';
import { DeleteFlow } from '../DeleteFlow/DeleteFlow.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ArrowLeftIcon from 'plenix-platform/icons/plenix/arrow-left';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import PencilIcon from 'plenix-platform/icons/plenix/pencil';
import PersonIcon from 'plenix-platform/icons/plenix/person';
import PlusIcon from 'plenix-platform/icons/plenix/plus';
import SettingsPermissionsIcon from 'plenix-platform/icons/plenix/settings-permissions';
import SettingsUsersIcon from 'plenix-platform/icons/plenix/settings-users';
import TrashIcon from 'plenix-platform/icons/plenix/trash';
import VisibilityIcon from 'plenix-platform/icons/plenix/visibility';
import { fill } from '../../utils/fill.ts';

const ROLE_ICONS = { owner: SettingsPermissionsIcon, editor: PencilIcon, viewer: VisibilityIcon };
const H = React.forwardRef(function H({ level, ...props }, ref) { return React.createElement('h' + Math.min(6, Math.max(2, level)), Object.assign({ ref }, props)); });

function groupsOf(permissions) {
  const order = [];
  const by = {};
  permissions.forEach((p) => { const g = p.group || ''; if (!by[g]) { by[g] = []; order.push(g); } by[g].push(p); });
  return order.map((g) => [g, by[g]]);
}

export function RoleManager({ roles = [], permissions = [], people = [], onChange, view, roleId, onViewChange, defaultView = 'list',
  defaultRoleId, readOnly = false, label, headingLevel = 2, strings, className, ...rest }) {
  const t = useStrings('roleManager', strings);
  const [ownView, setOwnView] = React.useState(defaultView);
  const [ownId, setOwnId] = React.useState(defaultRoleId || (roles[0] && roles[0].id));
  const shown = view || ownView;
  const id = roleId !== undefined ? roleId : ownId;
  const role = roles.find((r) => r.id === id);
  const back = React.useRef(null);   // the role whose name to focus when the list returns
  const go = (v, rid) => {
    if (v === 'list') back.current = id;
    if (view === undefined) setOwnView(v);
    if (roleId === undefined && rid !== undefined) setOwnId(rid);
    if (onViewChange) onViewChange(v, rid);
  };
  const change = (next, c) => { if (onChange) onChange(next, c); };
  const editable = !readOnly && !!onChange;
  return (
    <div className={cx('plx-role-manager', 'plx-role-manager--' + (shown === 'detail' && role ? 'detail' : 'list'), className)} {...rest}>
      {shown === 'detail' && role
        ? <RoleDetail role={role} roles={roles} permissions={permissions} people={people} t={t} editable={editable} headingLevel={headingLevel}
          onBack={() => go('list')} change={change} onOpen={(rid) => go('detail', rid)} />
        : <RoleList roles={roles} t={t} label={label} editable={editable} focusId={back} change={change} permissions={permissions} onOpen={(rid) => go('detail', rid)} />}
    </div>
  );
}

function RoleList({ roles, t, label, editable, focusId, change, onOpen }) {
  const box = React.useRef(null);
  const [creating, setCreating] = React.useState(false);
  React.useEffect(() => {
    // back from a detail: focus the name of the role that was open
    if (!focusId.current || !box.current) return;
    const i = roles.findIndex((r) => r.id === focusId.current);
    const names = box.current.querySelectorAll('.plx-resource-list__opener');
    if (names[i] && names[i].focus) names[i].focus();
    focusId.current = null;
  }, []);
  const items = roles.map((r) => {
    const n = (r.members || []).length;
    return {
      id: r.id, name: r.name, description: r.description, onOpen: () => onOpen(r.id),
      media: <Icon name={ROLE_ICONS[r.builtIn] || PersonIcon} size="sm" className="plx-role-manager__icon" />,
      meta: <span className="plx-role-manager__meta"><span>{around(n === 1 ? t.memberCount : t.membersCount, 'n', <Text variant="data">{formatNumber(n)}</Text>)}</span>
        <span className="plx-role-manager__kind">{r.builtIn ? t.builtIn : t.custom}</span></span>,
    };
  });
  return (
    <div ref={box} className="plx-role-manager__list">
      {editable ? <div className="plx-role-manager__bar"><Button icon={PlusIcon} onClick={() => setCreating(true)}>{t.create}</Button></div> : null}
      <ResourceList label={label || t.roles} noun={t.role} items={items} />
      {editable ? <CreateRole open={creating} roles={roles} t={t} onClose={() => setCreating(false)}
        onCreate={(r) => { setCreating(false); change(roles.concat(r), { type: 'create', role: r }); announce(fill(t.created, { name: r.name })); onOpen(r.id); }} /> : null}
    </div>
  );
}

// a new custom role: its name, a sentence, and the role whose permissions it starts with
function CreateRole({ open, roles, t, onClose, onCreate }) {
  const [name, setName] = React.useState('');
  const [about, setAbout] = React.useState('');
  const [from, setFrom] = React.useState('');
  const [error, setError] = React.useState('');
  const field = React.useRef(null);
  const formId = useUid('plx-role-manager-create');
  React.useEffect(() => { if (open) { setName(''); setAbout(''); setFrom(roles[roles.length > 1 ? 1 : 0] ? roles[roles.length > 1 ? 1 : 0].id : ''); setError(''); } }, [open]);
  const submit = (e) => {
    e.preventDefault();
    const n = name.trim();
    const problem = !n ? t.empty : roles.some((r) => r.name.toLowerCase() === n.toLowerCase()) ? fill(t.taken, { name: '“' + n + '”' }) : '';
    setError(problem);
    if (problem) { if (field.current) field.current.focus(); return; }
    const base = roles.find((r) => r.id === from);
    onCreate({ id: 'role-' + Date.now().toString(36), name: n, description: about.trim(), permissions: base ? (base.permissions || []).slice() : [], members: [] });
  };
  return (
    <Dialog open={open} onClose={onClose} title={t.createTitle} size="sm" initialFocus={field}
      footer={<><Button onClick={onClose}>{t.cancel}</Button><Button variant="primary" type="submit" form={formId}>{t.create}</Button></>}>
      <form id={formId} noValidate onSubmit={submit} className="plx-role-manager__form">
        <Field label={t.name} required error={error || undefined}><Input ref={field} value={name} onChange={(e) => { setName(e.target.value); if (error) setError(''); }} /></Field>
        <Field label={t.description} description={t.descriptionHint}><Textarea rows={2} value={about} onChange={(e) => setAbout(e.target.value)} /></Field>
        <RadioGroup label={t.startFrom} value={from} onChange={setFrom}
          options={roles.map((r) => ({ value: r.id, label: r.name, description: r.description }))} />
      </form>
    </Dialog>
  );
}

function RoleDetail({ role, roles, permissions, people, t, editable, headingLevel, onBack, change, onOpen }) {
  const title = React.useRef(null);
  const [warning, setWarning] = React.useState('');
  React.useEffect(() => { if (title.current) title.current.focus(); setWarning(''); }, [role.id]);
  const members = role.members || [];
  const custom = !role.builtIn;
  const update = (patch, c) => change(roles.map((r) => (r.id === role.id ? Object.assign({}, r, patch) : r)), Object.assign({ role: role.id }, c));
  const person = (v) => people.find((p) => p.value === v) || { value: v, label: v };
  const toggle = (p, on) => {
    const next = on ? (role.permissions || []).concat(p.id) : (role.permissions || []).filter((x) => x !== p.id);
    update({ permissions: next }, { type: 'permissions', permission: p.id, allowed: on });
    announce(fill(on ? t.allowed : t.denied, { permission: p.label, role: role.name }));
  };
  const add = (v) => {
    if (!v || members.includes(v)) return;
    setWarning('');
    update({ members: members.concat(v) }, { type: 'add-member', person: v });   // AssignControl announces it (strings.assigned)
  };
  const remove = (v) => {
    if (role.required && members.length <= 1) { setWarning(fill(t.lastMember, { role: role.name })); return; }
    update({ members: members.filter((m) => m !== v) }, { type: 'remove-member', person: v });
    announce(fill(t.removed, { name: person(v).label, role: role.name }));
  };
  const allowed = new Set(role.permissions || []);
  const sub = headingLevel + 1;
  return (
    <div className="plx-role-manager__detail">
      <div className="plx-role-manager__back"><Button variant="ghost" size="sm" icon={ArrowLeftIcon} onClick={onBack}>{t.back}</Button></div>
      <header className="plx-role-manager__header">
        <div className="plx-role-manager__heading">
          <H level={headingLevel} ref={title} tabIndex={-1} className="plx-role-manager__title">{role.name}</H>
          <RoleLabel role={role.builtIn || 'custom'} label={role.builtIn ? undefined : role.name} category={role.category} description={role.description} />
        </div>
        {editable ? (
          <div className="plx-role-manager__actions">
            <DuplicateAction variant="rename" name={role.name} noun={t.role} taken={roles.map((r) => r.name)} size="sm"
              options={[{ id: 'members', label: t.members }]}
              onDuplicate={(n, chosen) => {
                const copy = { id: 'role-' + Date.now().toString(36), name: n, description: role.description, permissions: (role.permissions || []).slice(),
                  members: (chosen || []).includes('members') ? members.slice() : [] };
                change(roles.concat(copy), { type: 'duplicate', role: copy, from: role.id }); onOpen(copy.id);
              }} />
            {custom ? <DeleteFlow items={[{ id: role.id, label: role.name }]} noun={t.role}
              onDelete={() => { change(roles.filter((r) => r.id !== role.id), { type: 'delete', role: role.id }); onBack(); }}
              trigger={<Button size="sm" variant="danger-secondary" icon={TrashIcon}>{t.delete}</Button>} /> : null}
          </div>
        ) : null}
        {role.description ? <p className="plx-role-manager__description">{role.description}</p> : null}
      </header>

      <section className="plx-role-manager__section" aria-labelledby={'plx-rm-perm-' + role.id}>
        <H level={sub} id={'plx-rm-perm-' + role.id} className="plx-role-manager__section-title">{t.permissions}</H>
        {custom && editable ? (
          <div className="plx-role-manager__groups">
            {groupsOf(permissions).map(([g, list]) => (
              <Fieldset key={g || 'all'} legend={g || t.permissions} hideLegend={!g}>
                {list.map((p) => <Checkbox key={p.id} label={p.label} description={p.description} checked={allowed.has(p.id)} onChange={(e) => toggle(p, e.target.checked)} />)}
              </Fieldset>
            ))}
          </div>
        ) : (
          <>
            <PermissionSummary icon={SettingsUsersIcon} access={fill(t.access, { role: role.name })} detail={fill(members.length === 1 ? t.peopleOne : t.people, { n: formatNumber(members.length) })}
              can={permissions.filter((p) => allowed.has(p.id)).map((p) => p.label)} cannot={permissions.filter((p) => !allowed.has(p.id)).map((p) => p.label)} />
            {editable && !custom ? <p className="plx-role-manager__note">{t.builtInNote}</p> : null}
          </>
        )}
      </section>

      <section className="plx-role-manager__section" aria-labelledby={'plx-rm-members-' + role.id}>
        <H level={sub} id={'plx-rm-members-' + role.id} className="plx-role-manager__section-title">
          {t.members} <span className="plx-role-manager__count"><Text variant="data">{formatNumber(members.length)}</Text></span>
        </H>
        {warning ? <Notice tone="warning" onDismiss={() => setWarning('')}>{warning}</Notice> : null}
        {members.length ? (
          <ResourceList label={t.members} noun={t.member} items={members.map((v) => {
            const p = person(v);
            return { id: v, name: p.label, description: p.description, avatar: { name: p.label, src: p.src },
              meta: <RoleLabel role={role.builtIn || 'custom'} label={role.builtIn ? undefined : role.name} category={role.category} />,
              actions: editable ? <Button size="xs" variant="ghost" iconOnly icon={CloseIcon} label={fill(t.remove, { name: p.label })} onClick={() => remove(v)} /> : null };
          })} />
        ) : <p className="plx-role-manager__note">{t.noMembers}</p>}
        {editable ? (
          <div className="plx-role-manager__add">
            <AssignControl label={t.addMember} people={people.filter((p) => !members.includes(p.value))} value={null} clearable={false} onChange={(v) => add(v)}
              strings={{ assigned: fill(t.added, { name: '{name}', role: role.name }) }} />
          </div>
        ) : null}
      </section>
    </div>
  );
}
