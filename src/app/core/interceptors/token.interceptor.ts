import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';

const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true);
}


export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(CHECK_TOKEN)) {
    const tokenService = inject(TokenService);
    const isValidToken = tokenService.isValidToken();
    if (isValidToken) {
      return addToken(req, next);
    } else {
      return next(req);
    }
  } else {
    return next(req);
  }
};

const addToken: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();
  const bearer = 'Bearer ' + token;
  if (token) {
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', bearer)
    });
    return next(authRequest);
  } else {
    return next(req);
  }
}

