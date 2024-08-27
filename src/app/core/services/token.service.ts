import { Injectable } from '@angular/core';
import { setCookie, getCookie, removeCookie } from 'typescript-cookie';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  saveToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      setCookie('token', token, { expires: 12, path: '/' });
    }
  }

  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      const token = getCookie('token') || '';
      return token;
    } else {
      return '';
    }
  }

  removeToken() {
    if (isPlatformBrowser(this.platformId)) {
      removeCookie('token');
    }
  }

  isValidToken() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const decodeToken = jwt_decode<JwtPayload>(token);
    if (decodeToken && decodeToken?.exp) {
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp);
      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    }
    return false;
  }

}
