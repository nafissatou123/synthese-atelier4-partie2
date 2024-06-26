//import { HttpInterceptorFn } from '@angular/common/http';
import {Injectable} from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import {finalize, Observable} from "rxjs";
import {AppStateService} from "./app-state.service";
import {LoadingService} from "./loading.service";

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor{
  constructor(public appState : AppStateService, private loadingService : LoadingService){}

  intercept(request: HttpRequest<unknown>, next : HttpHandler): Observable <HttpEvent<any>>{
    // this.appState.setProductState({
    //   status : "LOADING"
    // })
    this.loadingService.showLoadingSpinner();
    let req = request.clone({
      headers: request.headers.set("Autorization","Beaner JWT")
    });
    return  next.handle(req).pipe(
      finalize(()=>
        // this.appState.setProductState({
        //   status : "LOADED"
        // })
        this.loadingService.hideLoadingSpinner()
      )
    );

  }
}
