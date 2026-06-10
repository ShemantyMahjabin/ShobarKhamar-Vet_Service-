import { useEffect, useSyncExternalStore } from 'react';

export type VetPresence = 'online' | 'offline';
export type ConsultationRequestStatus = 'pending' | 'accepted' | 'rejected';
export type ConsultationRequestKind = 'instant-video' | 'scheduled-video';

export type ConsultationRequest = {
  id: string;
  vetId: number;
  vetName: string;
  farmerName: string;
  animalIds: string[];
  symptoms: string;
  kind: ConsultationRequestKind;
  status: ConsultationRequestStatus;
  requestedAt: string;
  scheduledFor?: string;
  expiresAt?: string;
};

const PRESENCE_KEY = 'vet-presence-by-id';
const REQUESTS_KEY = 'vet-consultation-requests';
const STORE_EVENT = 'vet-consultation-store-change';

const defaultPresence: Record<number, VetPresence> = {
  1: 'online',
  2: 'offline',
  3: 'offline',
};

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function emitStoreChange() {
  window.dispatchEvent(new Event(STORE_EVENT));
}

function readPresenceMap() {
  if (typeof window === 'undefined') return defaultPresence;
  return { ...defaultPresence, ...safeParse<Record<number, VetPresence>>(localStorage.getItem(PRESENCE_KEY), {}) };
}

function writePresenceMap(presence: Record<number, VetPresence>) {
  localStorage.setItem(PRESENCE_KEY, JSON.stringify(presence));
  emitStoreChange();
}

function removeExpiredRequests(requests: ConsultationRequest[]) {
  const now = Date.now();
  return requests.filter((request) => {
    if (request.status !== 'pending') return true;
    if (!request.expiresAt) return true;
    return new Date(request.expiresAt).getTime() >= now;
  });
}

function readRequestsFromStorage() {
  if (typeof window === 'undefined') return [];

  const stored = safeParse<ConsultationRequest[]>(localStorage.getItem(REQUESTS_KEY), []);
  const active = removeExpiredRequests(stored);

  if (active.length !== stored.length) {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(active));
    queueMicrotask(emitStoreChange);
  }

  return active;
}

function writeRequests(requests: ConsultationRequest[]) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(removeExpiredRequests(requests)));
  emitStoreChange();
}

function subscribe(listener: () => void) {
  window.addEventListener(STORE_EVENT, listener);
  window.addEventListener('storage', listener);

  return () => {
    window.removeEventListener(STORE_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}

function getSnapshot() {
  return JSON.stringify({
    presence: readPresenceMap(),
    requests: readRequestsFromStorage(),
  });
}

function getServerSnapshot() {
  return JSON.stringify({
    presence: defaultPresence,
    requests: [],
  });
}

export function useVetConsultationStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const interval = window.setInterval(emitStoreChange, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return JSON.parse(snapshot) as {
    presence: Record<number, VetPresence>;
    requests: ConsultationRequest[];
  };
}

export function getVetPresence(vetId: number) {
  return readPresenceMap()[vetId] ?? 'offline';
}

export function setVetPresence(vetId: number, status: VetPresence) {
  writePresenceMap({ ...readPresenceMap(), [vetId]: status });
}

export function createConsultationRequest(
  request: Omit<ConsultationRequest, 'id' | 'requestedAt' | 'status'>,
) {
  const nextRequest: ConsultationRequest = {
    ...request,
    id: `${request.vetId}-${Date.now()}`,
    requestedAt: new Date().toISOString(),
    status: 'pending',
  };

  writeRequests([nextRequest, ...readRequestsFromStorage()]);
  return nextRequest;
}

export function updateConsultationRequestStatus(requestId: string, status: ConsultationRequestStatus) {
  if (status === 'rejected') {
    writeRequests(readRequestsFromStorage().filter((request) => request.id !== requestId));
    return;
  }

  writeRequests(
    readRequestsFromStorage().map((request) =>
      request.id === requestId ? { ...request, status } : request,
    ),
  );
}
