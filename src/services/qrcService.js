// src/services/qrcService.js
// QRC frontend service using fetch + async/await (no axios).
// Configure base URL in .env (CRA): REACT_APP_API_BASE_URL or API_BASE_URL
const API_BASE = (typeof process !== 'undefined' && (process.env.REACT_APP_API_BASE_URL || process.env.API_BASE_URL)) || '/api';
const RESOURCE = 'qrc'; // change if backend uses a different resource name

/* ---------- Helpers ---------- */
async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let message = text || res.statusText || `HTTP ${res.status}`;
    try {
      const json = JSON.parse(text);
      message = json.message || JSON.stringify(json);
    } catch (e) { /* not json */ }
    const err = new Error(message);
    err.status = res.status;
    err.data = text;
    throw err;
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.blob();
}

const rootPath = (id) => {
  if (id !== undefined && id !== null) {
    return `${API_BASE}/${RESOURCE}/${encodeURIComponent(String(id))}/`;
  }
  return `${API_BASE}/${RESOURCE}/`;
};

const buildUrl = (path = '', params) => {
  const baseUrl = path.startsWith('/') ? `${API_BASE}${path}` : `${API_BASE}/${RESOURCE}/${path}`;
  if (!params || Object.keys(params).length === 0) return baseUrl;
  const u = new URL(baseUrl, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) u.searchParams.set(k, v);
  });
  return u.toString();
};

function _preparePayload(data = {}) {
  const copy = { ...data };
  if (copy.callDateTime) {
    try {
      const dt = new Date(copy.callDateTime);
      if (!Number.isNaN(dt.getTime())) copy.callDateTime = dt.toISOString();
    } catch (e) { /* leave as-is */ }
  }
  return copy;
}

/* ---------- CRUD ---------- */

export async function list(params = {}) {
  const url = buildUrl('', params);
  const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
  return handleResponse(res);
}

export async function retrieve(id) {
  if (id === undefined || id === null) throw { status: 400, data: 'ID is required for retrieve()' };
  const res = await fetch(rootPath(id), { method: 'GET', headers: { Accept: 'application/json' } });
  return handleResponse(res);
}

export async function create(data) {
  const payload = _preparePayload(data);
  const res = await fetch(rootPath(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function update(id, data) {
  if (id === undefined || id === null) throw { status: 400, data: 'ID is required for update()' };
  const payload = _preparePayload(data);
  const res = await fetch(rootPath(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function partialUpdate(id, data) {
  if (id === undefined || id === null) throw { status: 400, data: 'ID is required for partialUpdate()' };
  const payload = _preparePayload(data);
  const res = await fetch(rootPath(id), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function destroy(id) {
  if (id === undefined || id === null) throw { status: 400, data: 'ID is required for destroy()' };
  const res = await fetch(rootPath(id), { method: 'DELETE', headers: { Accept: 'application/json' } });
  return handleResponse(res);
}

/* ---------- custom ---------- */
/**
 * custom(path, method = 'get', data = {}, config = {})
 * path can be absolute (starts with '/') or relative to resource
 */
export async function custom(path, method = 'get', data = {}, config = {}) {
  const lower = String(method || 'get').toLowerCase();
  const url = path.startsWith('/') ? `${API_BASE}${path}` : `${API_BASE}/${RESOURCE}/${path}`;
  const opts = { method: lower.toUpperCase(), headers: { Accept: 'application/json' }, ...config };

  if (lower === 'get' || lower === 'delete') {
    const u = new URL(url, window.location.origin);
    Object.entries(data || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) u.searchParams.set(k, v);
    });
    const res = await fetch(u.toString(), opts);
    return handleResponse(res);
  }

  opts.headers = { 'Content-Type': 'application/json', Accept: 'application/json', ...(opts.headers || {}) };
  opts.body = JSON.stringify(_preparePayload(data || {}));
  const res = await fetch(url, opts);
  return handleResponse(res);
}

/* ---------- conveniences ---------- */

export async function searchQrc(q) {
  return list({ search: q });
}

export async function filterQrcByType(type) {
  if (!type || type === 'all') return list();
  return list({ callType: type });
}

/* ---------- download / upload ---------- */

export async function downloadPDF(id) {
  if (!id) throw { status: 400, data: 'ID required' };
  const url = `${API_BASE}/${RESOURCE}/${encodeURIComponent(String(id))}/download`;
  const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/pdf' } });
  if (!res.ok) throw await handleResponse(res);
  return res.blob();
}

export async function uploadAttachment(id, file) {
  if (!id) throw { status: 400, data: 'ID required' };
  const url = `${API_BASE}/${RESOURCE}/${encodeURIComponent(String(id))}/attachments/`;
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(url, { method: 'POST', body: form });
  return handleResponse(res);
}

/* ---------- default export ---------- */
const qrcService = {
  list,
  retrieve,
  create,
  update,
  partialUpdate,
  destroy,
  custom,
  searchQrc,
  filterQrcByType,
  downloadPDF,
  uploadAttachment,
};

export default qrcService;
