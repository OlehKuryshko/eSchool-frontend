import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';

import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  baseUrl = 'https://fierce-shore-32592.herokuapp.com';

  constructor(private authService: AuthenticationService,
    private router: Router) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
      'Access-Control-Allow-Headers': 'accept, content-type'
    })
  };

  intercept(req, next) {
    const reqWithUrl = req.clone({
      url: this.appendBaseUrl(req.url)
    });
    const token = this.authService.getToken();
    if (token == null || token === '') {
      if (this.router.url !== '/login' && this.router.url !== '/login/') {
        this.router.navigate(['/login']);
      }
      return next.handle(reqWithUrl);
    }

    const tokenizedReq = reqWithUrl.clone({
      headers: req.headers.set('Authorization', token)
    });
    return next
      .handle(tokenizedReq)
      .catch((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 401) {
          this.authService.logOut();
          this.router.navigate(['/login']);
        }
        return Observable.throw(errorResponse);
      });
  }

  appendBaseUrl(url) {
    if (url.startsWith('http')) {
      return url;
    }
    if (!url.startsWith('/')) {
      url = '/' + url;
    }
    return this.baseUrl + url;
  }
}

