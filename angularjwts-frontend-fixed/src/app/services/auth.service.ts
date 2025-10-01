import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwt');
    }
    return null;
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      let role = payload.role || payload.authorities || null;
      if (!role) return null;
      // role may be "ROLE_ADMIN" or ["ROLE_ADMIN"] or "ADMIN"
      if (Array.isArray(role)) {
        role = role[0];
      }
      role = String(role).replace(/^ROLE_/, '').toUpperCase();
      return role;
    } catch (e) {
      console.error('Invalid token payload', e);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
