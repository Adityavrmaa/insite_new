import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export class AuthInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = localStorage.getItem('token');
        if (!token) token = '';
         
        let url = environment.baseUrl;

        url += req.url;

        console.log(url);

        const copiedReq = req.clone({
            headers: req.headers.append('access_token', token), url: url
        });
        return next.handle(copiedReq);
    }
}