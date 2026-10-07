'use client';

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchAPI, getUser, logout } from '@/lib/api';

type FieldType = 'text' | 'email' | 'url' | 'number' | 'textarea' | 'boolean' | 'image' | 'select';
type FieldDefinition = {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  relation?: string;
};
type Resource = {
  key: string;
  label: string;
  icon: string;
  endpoint: string;
  fields: FieldDefinition[];
  columns: string[];
  singleton?: boolean;
  lookup?: string;
  noCreate?: boolean;
};
type RecordValue = string | number | boolean | null | File;
type RecordData = Record<string, unknown>;
type ListResponse = { count?: number; next?: string | null; previous?: string | null; results?: RecordData[] };
type RelationOptions = Record<string, RecordData[]>;

const resources: Resource[] = [
  {
    key: 'heroes', label: 'Hero Slides', icon: '✦', endpoint: '/heroes/',
    fields: [
      { name: 'title', label: 'Title', required: true }, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'background_image', label: 'Background image', type: 'image' }, { name: 'cta_text', label: 'Button label' },
      { name: 'cta_link', label: 'Button link' }, { name: 'order', label: 'Display order', type: 'number' },
      { name: 'is_active', label: 'Published', type: 'boolean' },
    ],
    columns: ['title', 'order', 'is_active'],
  },
  {
    key: 'projects', label: 'Projects', icon: '▦', endpoint: '/projects/', lookup: 'slug',
    fields: [
      { name: 'title', label: 'Project title', required: true }, { name: 'slug', label: 'URL slug' },
      { name: 'category', label: 'Category', type: 'select', relation: 'project-categories' },
      { name: 'short_description', label: 'Short description', type: 'textarea' },
      { name: 'description', label: 'Full description', type: 'textarea' }, { name: 'location', label: 'Location' },
      { name: 'client', label: 'Client' }, { name: 'year', label: 'Year', type: 'number' },
      { name: 'status', label: 'Status', type: 'select', options: [
        { value: 'completed', label: 'Completed' }, { value: 'ongoing', label: 'Ongoing' }, { value: 'upcoming', label: 'Upcoming' },
      ] },
      { name: 'featured_image', label: 'Featured image', type: 'image' },
      { name: 'is_featured', label: 'Feature on homepage', type: 'boolean' }, { name: 'order', label: 'Display order', type: 'number' },
    ],
    columns: ['title', 'location', 'year', 'status', 'is_featured'],
  },
  {
    key: 'project-categories', label: 'Project Categories', icon: '⌂', endpoint: '/project-categories/',
    fields: [{ name: 'name', label: 'Name', required: true }, { name: 'slug', label: 'URL slug' }, { name: 'description', label: 'Description', type: 'textarea' }],
    columns: ['name', 'slug'],
  },
  {
    key: 'project-images', label: 'Project Images', icon: '▧', endpoint: '/project-images/',
    fields: [
      { name: 'project', label: 'Project', type: 'select', relation: 'projects', required: true },
      { name: 'image', label: 'Image file', type: 'image', required: true },
      { name: 'caption', label: 'Caption' }, { name: 'order', label: 'Display order', type: 'number' },
    ],
    columns: ['project', 'caption', 'order'],
  },
  {
    key: 'about', label: 'About Content', icon: '◫', endpoint: '/about/', singleton: true,
    fields: [
      { name: 'title', label: 'Page title', required: true }, { name: 'short_description', label: 'Short description', type: 'textarea' },
      { name: 'full_content', label: 'Full content', type: 'textarea' }, { name: 'vision', label: 'Vision', type: 'textarea' },
      { name: 'mission', label: 'Mission', type: 'textarea' }, { name: 'values', label: 'Values', type: 'textarea' },
      { name: 'image', label: 'About image', type: 'image' }, { name: 'years_of_experience', label: 'Years of experience', type: 'number' },
      { name: 'projects_completed', label: 'Projects completed', type: 'number' }, { name: 'clients_served', label: 'Clients served', type: 'number' },
      { name: 'team_members', label: 'Team members', type: 'number' },
    ],
    columns: ['title', 'years_of_experience', 'projects_completed'],
  },
  {
    key: 'philosophies', label: 'Philosophy', icon: '◇', endpoint: '/philosophies/',
    fields: [
      { name: 'title', label: 'Principle', required: true }, { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'icon', label: 'Icon name' }, { name: 'order', label: 'Display order', type: 'number' },
      { name: 'is_active', label: 'Published', type: 'boolean' },
    ],
    columns: ['title', 'order', 'is_active'],
  },
  {
    key: 'management', label: 'Management', icon: '♙', endpoint: '/management/',
    fields: [
      { name: 'name', label: 'Name', required: true }, { name: 'position', label: 'Position', required: true },
      { name: 'bio', label: 'Biography', type: 'textarea' }, { name: 'photo', label: 'Profile photo', type: 'image' },
      { name: 'email', label: 'Email', type: 'email' }, { name: 'linkedin', label: 'LinkedIn profile', type: 'url' },
      { name: 'order', label: 'Display order', type: 'number' }, { name: 'is_active', label: 'Published', type: 'boolean' },
      { name: 'is_md', label: 'Managing Director', type: 'boolean' },
    ],
    columns: ['name', 'position', 'is_md', 'is_active'],
  },
  {
    key: 'md-message', label: 'MD Message', icon: '✉', endpoint: '/md-message/', singleton: true,
    fields: [
      { name: 'title', label: 'Title', required: true }, { name: 'message', label: 'Message', type: 'textarea', required: true },
      { name: 'photo', label: 'Portrait', type: 'image' }, { name: 'name', label: 'Name' }, { name: 'designation', label: 'Designation' },
    ],
    columns: ['title', 'name', 'designation'],
  },
  {
    key: 'equipment', label: 'Equipment', icon: '⚒', endpoint: '/equipment/',
    fields: [
      { name: 'name', label: 'Equipment name', required: true }, { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'quantity', label: 'Quantity', type: 'number' }, { name: 'category', label: 'Category' },
      { name: 'image', label: 'Image', type: 'image' }, { name: 'order', label: 'Display order', type: 'number' },
      { name: 'is_active', label: 'Published', type: 'boolean' },
    ],
    columns: ['name', 'category', 'quantity', 'is_active'],
  },
  {
    key: 'manpower', label: 'Manpower', icon: '♟', endpoint: '/manpower/',
    fields: [
      { name: 'role', label: 'Role', required: true }, { name: 'category', label: 'Category', type: 'select', relation: 'manpower-categories' },
      { name: 'count', label: 'Team size', type: 'number' }, { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'order', label: 'Display order', type: 'number' }, { name: 'is_active', label: 'Published', type: 'boolean' },
    ],
    columns: ['role', 'category_name', 'count', 'is_active'],
  },
  {
    key: 'manpower-categories', label: 'Manpower Categories', icon: '♧', endpoint: '/manpower-categories/',
    fields: [{ name: 'name', label: 'Name', required: true }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'order', label: 'Display order', type: 'number' }],
    columns: ['name', 'order'],
  },
  {
    key: 'gallery', label: 'Gallery Images', icon: '▣', endpoint: '/gallery/',
    fields: [
      { name: 'title', label: 'Title' }, { name: 'category', label: 'Category', type: 'select', relation: 'gallery-categories' },
      { name: 'image', label: 'Image file', type: 'image', required: true }, { name: 'caption', label: 'Caption' },
      { name: 'order', label: 'Display order', type: 'number' }, { name: 'is_featured', label: 'Featured', type: 'boolean' },
    ],
    columns: ['title', 'category_name', 'caption', 'is_featured'],
  },
  {
    key: 'gallery-categories', label: 'Gallery Categories', icon: '▤', endpoint: '/gallery-categories/',
    fields: [{ name: 'name', label: 'Name', required: true }, { name: 'slug', label: 'URL slug' }],
    columns: ['name', 'slug'],
  },
  {
    key: 'contacts', label: 'Contact Inbox', icon: '☏', endpoint: '/contacts/', noCreate: true,
    fields: [{ name: 'is_read', label: 'Mark as read', type: 'boolean' }],
    columns: ['name', 'email', 'subject', 'is_read', 'created_at'],
  },
  {
    key: 'settings', label: 'Site Settings', icon: '⚙', endpoint: '/settings/', singleton: true,
    fields: [
      { name: 'company_name', label: 'Company name', required: true }, { name: 'tagline', label: 'Tagline' },
      { name: 'logo', label: 'Logo', type: 'image' }, { name: 'email', label: 'Contact email', type: 'email' },
      { name: 'phone', label: 'Phone' }, { name: 'address', label: 'Address', type: 'textarea' },
      { name: 'facebook', label: 'Facebook', type: 'url' }, { name: 'linkedin', label: 'LinkedIn', type: 'url' },
      { name: 'twitter', label: 'Twitter / X', type: 'url' }, { name: 'instagram', label: 'Instagram', type: 'url' },
      { name: 'youtube', label: 'YouTube', type: 'url' }, { name: 'footer_text', label: 'Footer text', type: 'textarea' },
    ],
    columns: ['company_name', 'email', 'phone'],
  },
];

const navigation = [
  { key: 'overview', label: 'Overview', icon: '▦' },
  ...resources.map(({ key, label, icon }) => ({ key, label, icon })),
];

function getRows(response: unknown): RecordData[] {
  if (Array.isArray(response)) return response as RecordData[];
  if (response && typeof response === 'object' && 'results' in response && Array.isArray(response.results)) {
    return response.results as RecordData[];
  }
  if (response && typeof response === 'object') return [response as RecordData];
  return [];
}

function getLabel(record: RecordData, relation?: string): string {
  if (relation === 'projects') return String(record.title || record.name || record.id);
  return String(record.name || record.title || record.role || record.id);
}

function displayValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') {
    if ('name' in value) return String(value.name);
    if ('title' in value) return String(value.title);
    if ('url' in value) return String(value.url);
  }
  const text = String(value);
  return text.length > 100 ? `${text.slice(0, 100)}…` : text;
}

function recordKey(resource: Resource, record: RecordData): string {
  return String(record[resource.lookup || 'id'] ?? record.id ?? '');
}

function AdminDataManager({ resource }: { resource: Resource }) {
  const [rows, setRows] = useState<RecordData[]>([]);
  const [relationOptions, setRelationOptions] = useState<RelationOptions>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<RecordData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [values, setValues] = useState<Record<string, RecordValue>>({});

  const loadRows = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchAPI<unknown>(`${resource.endpoint}${resource.singleton ? '' : `?page=${page}`}`);
      const resultRows = getRows(response);
      setRows(resultRows);
      if (!resource.singleton && response && typeof response === 'object' && 'count' in response) {
        setPageCount(Math.max(1, Math.ceil(Number((response as ListResponse).count || 0) / 20)));
      } else {
        setPageCount(1);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load this content.');
    } finally {
      setLoading(false);
    }
  }, [page, resource]);

  useEffect(() => { void loadRows(); }, [loadRows]);

  const relationNames = useMemo(
    () => Array.from(new Set(resource.fields.flatMap((field) => field.relation ? [field.relation] : []))),
    [resource],
  );

  useEffect(() => {
    if (!relationNames.length) return;
    let cancelled = false;
    Promise.all(relationNames.map(async (name) => [name, getRows(await fetchAPI<unknown>(`/${name}/`))] as const))
      .then((entries) => {
        if (!cancelled) setRelationOptions(Object.fromEntries(entries));
      })
      .catch((loadError: unknown) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Unable to load related records.');
      });
    return () => { cancelled = true; };
  }, [relationNames]);

  const beginCreate = () => {
    setIsCreating(true);
    setEditing(null);
    setNotice('');
    setError('');
    setValues(Object.fromEntries(resource.fields.map((field) => [field.name, field.type === 'boolean' ? false : ''])));
  };

  const beginEdit = async (row: RecordData) => {
    setError('');
    setNotice('');
    setSaving(true);
    try {
      let fullRecord = row;
      if (!resource.singleton) {
        const key = recordKey(resource, row);
        fullRecord = await fetchAPI<RecordData>(`${resource.endpoint}${encodeURIComponent(key)}/`);
      }
      setEditing(fullRecord);
      setIsCreating(false);
      setValues(Object.fromEntries(resource.fields.map((field) => {
        const raw = fullRecord[field.name];
        const normalized = raw && typeof raw === 'object' && 'id' in raw ? raw.id : raw;
        return [field.name, (normalized ?? (field.type === 'boolean' ? false : '')) as RecordValue];
      })));
    } catch (editError) {
      setError(editError instanceof Error ? editError.message : 'Unable to load this record for editing.');
    } finally {
      setSaving(false);
    }
  };

  const closeEditor = () => {
    setEditing(null);
    setIsCreating(false);
  };

  const setField = (name: string, value: RecordValue) => {
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const saveRecord = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const hasUpload = resource.fields.some((field) => values[field.name] instanceof File);
      let body: BodyInit;
      if (hasUpload) {
        const formData = new FormData();
        for (const field of resource.fields) {
          const value = values[field.name];
          if (value instanceof File) formData.append(field.name, value);
          else if (field.type !== 'image' && value !== null && value !== undefined && value !== '') formData.append(field.name, String(value));
        }
        body = formData;
      } else {
        const json: Record<string, string | number | boolean> = {};
        for (const field of resource.fields) {
          const value = values[field.name];
          if (field.type === 'image' || value === null || value === undefined || value === '') continue;
          json[field.name] = typeof value === 'boolean' || typeof value === 'number' ? value : String(value);
        }
        body = JSON.stringify(json);
      }

      const key = editing ? recordKey(resource, editing) : '';
      const endpoint = resource.singleton
        ? `${resource.endpoint}${recordKey(resource, editing || rows[0] || {}) || '1'}/`
        : editing
          ? `${resource.endpoint}${encodeURIComponent(key)}/`
          : resource.endpoint;
      await fetchAPI<unknown>(endpoint, { method: editing || resource.singleton ? 'PATCH' : 'POST', body });
      closeEditor();
      setNotice(`${resource.label} ${editing || resource.singleton ? 'updated' : 'created'} successfully.`);
      await loadRows();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save this record.');
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (row: RecordData) => {
    const title = String(row.title || row.name || row.role || row.subject || `record ${row.id}`);
    if (!window.confirm(`Delete "${title}"? This action cannot be undone.`)) return;
    setError('');
    setNotice('');
    try {
      await fetchAPI<unknown>(`${resource.endpoint}${encodeURIComponent(recordKey(resource, row))}/`, { method: 'DELETE' });
      setNotice('Record deleted successfully.');
      await loadRows();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete this record.');
    }
  };

  const fieldControl = (field: FieldDefinition) => {
    const value = values[field.name];
    const common = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100';
    if (field.type === 'boolean') {
      return (
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setField(field.name, event.target.checked)}
            className="h-4 w-4 accent-red-600"
          />
          <span className="text-sm text-slate-700">Enabled</span>
        </label>
      );
    }
    if (field.type === 'image') {
      return (
        <div>
          {typeof value === 'string' && value && (
            <p className="mb-2 truncate text-xs text-slate-500">Current file: {value.split('/').pop()}</p>
          )}
          <input
            type="file"
            accept="image/*"
            required={field.required && !editing}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setField(field.name, event.target.files?.[0] || '')}
            className={`${common} file:mr-3 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-red-700`}
          />
        </div>
      );
    }
    if (field.type === 'select') {
      const options = field.options || (field.relation ? (relationOptions[field.relation] || []).map((row) => ({
        value: String(row.id),
        label: getLabel(row, field.relation),
      })) : []);
      return (
        <select
          required={field.required}
          value={value === null || value === undefined ? '' : String(value)}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => setField(field.name, event.target.value)}
          className={common}
        >
          <option value="">— Select —</option>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      );
    }
    if (field.type === 'textarea') {
      return (
        <textarea
          required={field.required}
          value={String(value ?? '')}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setField(field.name, event.target.value)}
          rows={4}
          className={`${common} resize-y`}
        />
      );
    }
    return (
      <input
        type={field.type || 'text'}
        required={field.required}
        value={String(value ?? '')}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setField(field.name, field.type === 'number' ? (event.target.value === '' ? '' : Number(event.target.value)) : event.target.value)}
        className={common}
      />
    );
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">Content management</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{resource.label}</h2>
          <p className="mt-1 text-sm text-slate-500">{resource.key === 'contacts' ? 'Review enquiries, mark them read, or remove submissions.' : `Create, update, and organize ${resource.label.toLowerCase()}.`}</p>
        </div>
        {!resource.noCreate && !resource.singleton && (
          <button type="button" onClick={beginCreate} className="btn-primary text-sm">
            <span aria-hidden="true">＋</span> Add {resource.singleton ? 'content' : 'new'}
          </button>
        )}
      </div>

      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

      {(isCreating || editing) && (
        <form onSubmit={saveRecord} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-semibold text-slate-900">{isCreating ? 'Create new record' : 'Edit record'}</h3>
              <p className="mt-1 text-xs text-slate-500">Fields marked required must be completed.</p>
            </div>
            <button type="button" onClick={closeEditor} className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Close</button>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {resource.fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {field.label}{field.required && <span className="ml-1 text-red-600">*</span>}
                </label>
                {fieldControl(field)}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button type="button" onClick={closeEditor} className="btn-outline text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-60">
              {saving ? 'Saving…' : isCreating ? 'Create record' : 'Save changes'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm text-slate-500">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" /> Loading records…
          </div>
        ) : rows.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="text-3xl text-slate-300">{resource.icon}</div>
            <p className="mt-3 font-medium text-slate-700">No records yet</p>
            <p className="mt-1 text-sm text-slate-500">{resource.noCreate ? 'New contact submissions will appear here.' : `Add your first ${resource.label.toLowerCase()} record.`}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    {resource.columns.map((column) => <th key={column} className="px-5 py-3.5 font-semibold">{column.replaceAll('_', ' ')}</th>)}
                    <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row) => (
                    <tr key={String(row.id)} className="transition-colors hover:bg-slate-50/80">
                      {resource.columns.map((column) => (
                        <td key={column} className="max-w-xs px-5 py-4 text-slate-700">
                          {column === 'created_at' || column === 'uploaded_at'
                            ? (row[column] ? new Date(String(row[column])).toLocaleString() : '—')
                            : displayValue(row[column])}
                        </td>
                      ))}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button type="button" disabled={saving} onClick={() => void beginEdit(row)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50">Edit</button>
                          {!resource.singleton && <button type="button" onClick={() => void deleteRecord(row)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50">Delete</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!resource.singleton && pageCount > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
                <span className="text-xs text-slate-500">Page {page} of {pageCount}</span>
                <div className="flex gap-2">
                  <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs disabled:opacity-40">Previous</button>
                  <button type="button" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs disabled:opacity-40">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default function AdminDashboard() {
  const [user, setUser] = useState<{ username: string; is_staff: boolean } | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ projects: 0, contacts: 0, manpower: 0 });
  const [statsError, setStatsError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || !currentUser.is_staff) {
      router.replace('/admin/login');
      return;
    }
    setUser(currentUser);
    Promise.all([
      fetchAPI<unknown>('/projects/'),
      fetchAPI<unknown>('/contacts/'),
      fetchAPI<unknown>('/manpower/'),
    ]).then(([projectsData, contactsData, manpowerData]) => {
      const total = (response: unknown) => response && typeof response === 'object' && 'count' in response
        ? Number(response.count || 0)
        : getRows(response).length;
      setStats({ projects: total(projectsData), contacts: total(contactsData), manpower: total(manpowerData) });
    }).catch((loadError: unknown) => {
      setStatsError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard statistics.');
    });
  }, [router]);

  if (!user) return <div className="flex min-h-screen items-center justify-center bg-slate-100"><div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" /></div>;

  const activeResource = resources.find((resource) => resource.key === activeTab);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <Image src="/logo.png" alt="ZH International" width={36} height={36} style={{ width: 'auto' }} />
            <span className="font-semibold tracking-tight">ZH <span className="text-red-400">ADMIN</span></span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="hidden text-sm text-slate-300 sm:inline">Signed in as <strong className="text-white">{user.username}</strong></span>
            <button onClick={() => { logout(); router.push('/admin/login'); }} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white transition hover:border-red-400 hover:bg-red-600">Sign out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        <aside className="sticky top-[61px] hidden h-[calc(100vh-61px)] w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-4 md:flex">
          <p className="px-3 pb-3 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Workspace</p>
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  activeTab === item.key ? 'bg-red-50 text-red-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="w-5 text-center text-base" aria-hidden="true">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <Link href="/" className="mt-4 border-t border-slate-100 px-3 pt-4 text-sm text-slate-500 transition hover:text-red-600">← View public website</Link>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-7 sm:py-8 lg:px-10">
          <div className="mb-6 md:hidden">
            <label htmlFor="admin-section" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Admin section</label>
            <select id="admin-section" value={activeTab} onChange={(event) => setActiveTab(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
              {navigation.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select>
          </div>

          {activeResource ? (
            <AdminDataManager key={activeResource.key} resource={activeResource} />
          ) : (
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">Administration</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Good to see you, {user.username}.</h1>
              <p className="mt-2 text-slate-500">Manage website content and keep your public information up to date.</p>
              {statsError && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{statsError}</div>}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Projects', value: stats.projects, icon: '▦', key: 'projects', tone: 'text-blue-700 bg-blue-50' },
                  { label: 'Manpower roles', value: stats.manpower, icon: '♟', key: 'manpower', tone: 'text-amber-700 bg-amber-50' },
                  { label: 'Contact submissions', value: stats.contacts, icon: '☏', key: 'contacts', tone: 'text-red-700 bg-red-50' },
                ].map((stat) => (
                  <button key={stat.key} type="button" onClick={() => setActiveTab(stat.key)} className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${stat.tone}`}>{stat.icon}</div>
                    <div className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{stat.value}</div>
                    <div className="mt-1 flex items-center justify-between text-sm text-slate-500">{stat.label}<span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-red-600">→</span></div>
                  </button>
                ))}
              </div>
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900">Content workspace</h2>
                    <p className="mt-1 text-sm text-slate-500">Choose a section to create and manage website content.</p>
                  </div>
                  <a href="http://localhost:8000/admin/" target="_blank" rel="noreferrer" className="btn-outline inline-flex items-center justify-center gap-2 text-sm">
                    Django Admin <span aria-hidden="true">↗</span>
                  </a>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {resources.map((resource) => (
                    <button key={resource.key} type="button" onClick={() => setActiveTab(resource.key)} className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 text-left transition hover:border-red-200 hover:bg-red-50/50">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">{resource.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{resource.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
