import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "./user.service";

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private userService: UserService, private appRouter: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        const isAdmin = this.userService.isAdmin;

        if(!isAdmin) {
            this.appRouter.navigate(['/planner']);
        }
        return isAdmin;
    }
}