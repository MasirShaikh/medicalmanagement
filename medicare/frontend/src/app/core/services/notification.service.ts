import { Injectable, computed, signal } from '@angular/core';
import { AuthService } from './auth.service';

export type NotifKind = 'patient' | 'doctor' | 'appointment' | 'prescription' | 'billing' | 'record';
export type NotifTone = 'success' | 'info' | 'danger' | 'warning';

export interface AppNotification {
  id: string;
  kind: NotifKind;
  tone: NotifTone;
  title: string;
  message: string;
  time: number;  
  read: boolean;
}

const MAX_ITEMS = 50;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  items = signal<AppNotification[]>([]);
  unreadCount = computed(() => this.items().filter(n => !n.read).length);

  private loadedKey = '';
  private labels = new Map<string, string>();   // "patients:12" -> "Wasi shaikh" (delete ke time naam dikhane ke liye)

  constructor(private auth: AuthService) {}

  /** Har user ki notifications alag save hoti hain (refresh karne par bhi bachi rehti hain). */
  sync(): void {
    const key = this.storageKey();
    if (key === this.loadedKey) { return; }
    this.loadedKey = key;
    if (!key) { this.items.set([]); return; }
    try {
      const raw = localStorage.getItem(key);
      this.items.set(raw ? (JSON.parse(raw) as AppNotification[]) : []);
    } catch {
      this.items.set([]);
    }
  }

  add(n: Pick<AppNotification, 'kind' | 'tone' | 'title' | 'message'>): void {
    this.sync();
    const item: AppNotification = {
      ...n,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      time: Date.now(),
      read: false,
    };
    this.items.update(list => [item, ...list].slice(0, MAX_ITEMS));
    this.save();
  }

  markAllRead(): void {
    if (this.unreadCount() === 0) { return; }
    this.items.update(list => list.map(n => ({ ...n, read: true })));
    this.save();
  }

  remove(id: string): void {
    this.items.update(list => list.filter(n => n.id !== id));
    this.save();
  }

  clear(): void {
    this.items.set([]);
    this.save();
  }

  /* ---- naam yaad rakhne ke liye (interceptor use karta hai) ---- */
  remember(resource: string, id: number | string, label: string): void {
    this.labels.set(`${resource}:${id}`, label);
  }
  label(resource: string, id?: string): string | undefined {
    return id ? this.labels.get(`${resource}:${id}`) : undefined;
  }

  private storageKey(): string {
    const u = this.auth.currentUser();
    return u ? `medicare_notifications_${u.username}` : '';
  }
  private save(): void {
    if (!this.loadedKey) { return; }
    try { localStorage.setItem(this.loadedKey, JSON.stringify(this.items())); } catch { /* storage full / blocked */ }
  }
}