const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export function getMediaUrl(path: string | null | undefined): string {
  if (!path?.trim()) return '';
  try {
    const mediaPath = path.trim();
    if (/^https?:\/\//i.test(mediaPath)) return mediaPath;
    const normalizedPath = mediaPath.startsWith('/')
      ? mediaPath
      : mediaPath.startsWith('media/')
        ? `/${mediaPath}`
        : `/media/${mediaPath}`;
    return new URL(normalizedPath, new URL(API_BASE).origin).toString();
  } catch {
    throw new Error(`Invalid media URL: ${path}`);
  }
}

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const headers: HeadersInit = {
    ...(options?.headers || {}),
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  // Don't set Content-Type for FormData
  if (!(options?.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    next: { revalidate: 60 }, // ISR for public pages
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || error.message || 'API Error');
  }

  return res.json();
}

type PaginatedResponse<T> = {
  results: T[];
};

async function fetchList<T>(endpoint: string): Promise<T[]> {
  const response = await fetchAPI<T[] | PaginatedResponse<T>>(endpoint);

  if (Array.isArray(response)) {
    return response;
  }

  if (response && typeof response === 'object' && Array.isArray(response.results)) {
    return response.results;
  }

  throw new Error(`Expected an array response from ${endpoint}`);
}

export async function login(username: string, password: string) {
  const data = await fetchAPI<{ access: string; refresh: string; username: string; is_staff: boolean }>(
    '/auth/login/',
    {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }
  );
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify({ username: data.username, is_staff: data.is_staff }));
  }
  return data;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

// Convenience fetchers
export const getHomepage = () => fetchAPI<any>('/homepage/');
export const getAbout = () => fetchAPI<any>('/about/');
export const getPhilosophies = () => fetchList<any>('/philosophies/');
export const getProjects = (params?: string) => fetchAPI<any>(`/projects/${params ? `?${params}` : ''}`);
export const getProject = (slug: string) => fetchAPI<any>(`/projects/${slug}/`);
export const getManagement = () => fetchList<any>('/management/');
export const getMDMessage = () => fetchAPI<any>('/md-message/');
export const getEquipment = () => fetchList<any>('/equipment/');
export const getManpower = () => fetchList<any>('/manpower/');
export const getGallery = (params?: string) => fetchAPI<any>(`/gallery/${params ? `?${params}` : ''}`);
export const getSettings = () => fetchAPI<any>('/settings/');
export const submitContact = (data: any) => fetchAPI('/contacts/', { method: 'POST', body: JSON.stringify(data) });
