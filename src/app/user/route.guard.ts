import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { UserService } from "./user.service";
import { Observable } from "rxjs";

@Injectable()
export class RouteGuard implements CanActivate {

    constructor(private userService: UserService, private appRouter: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        const isAuth = this.userService.isAuthenticated;

        if(!isAuth) {
            this.appRouter.navigate(['/login']);
        }

        return isAuth;
    }
}