import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ResponseData } from './../responseData.model';
import { Subject } from 'rxjs';
import { SocketService } from '../socket.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  public authToken: string;
  public baseUrl = "http://localhost:4000/api/user";

  public userId: string;
  public userIdListener = new Subject<any>();

  public allUsers = [];
  public allUsersListener = new Subject<any>();

  public allAdminUsers = [];
  public allAdminUsersListener = new Subject<any>();

  public allNormalUsers = [];
  public allNormalUsersListener = new Subject<any>();

  public isAuthenticated: boolean = false;
  public authStatusListener = new Subject<boolean>();

  public isAdmin: boolean = false;
  public adminStatusListener = new Subject<boolean>();

  public userFullName: string;
  public fullNameListener = new Subject<any>();

  private tokenTimer: any;


  constructor(private socketService: SocketService, private http: HttpClient, private appRouter: Router) { }


  private saveAuthData(token:string, expirationDate: Date, userId: string, fullName: string, isAdmin: boolean) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('fullName', fullName);
    localStorage.setItem('isAdmin', isAdmin.toString());
  }

  private getAuthData() {
    const token = localStorage.getItem('authToken');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const fullName = localStorage.getItem('fullName');
    const admin = localStorage.getItem('isAdmin');
    let isAdmin: boolean;
    
    if (!token || !expiration) {
      return;
    }
    
    if(admin == 'true') {
      isAdmin = true;
    } else {
      isAdmin = false;
    }

    let userData = {
      authToken: token,
      expiration: new Date(expiration),
      userId: userId,
      fullName: fullName,
      isAdmin: isAdmin
    };

    return userData;

  }


  private removeAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('isAdmin');
  }


  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }


  autoAuth() {
    const userAuthInfo = this.getAuthData();
    if(userAuthInfo) {

      const now = new Date();
      const expiresIn = userAuthInfo.expiration.getTime() - now.getTime();
      if (expiresIn > 5) {
        this.authToken = userAuthInfo.authToken;
        this.isAuthenticated = true;
        this.authStatusListener.next(true);

        this.userId = userAuthInfo.userId;
        this.userIdListener.next(this.userId);

        this.userFullName = userAuthInfo.fullName;
        this.fullNameListener.next(this.userFullName);

        this.isAdmin = userAuthInfo.isAdmin;
        this.adminStatusListener.next(this.isAdmin);

        this.setAuthTimer(expiresIn / 1000);
        
        this.socketService.verifyUser(this.authToken);
        this.socketService.setUser(this.authToken);

        if (this.isAdmin == true) {
          this.appRouter.navigate(['/dashboard']);
        } else {
          this.appRouter.navigate(['/planner', this.userId]);
        }
      } else {
        return;
      }

    }
  }

 
  createUser (userData) {
    this.http.post<ResponseData>(`${this.baseUrl}/create`, userData)
    .subscribe((response) => {
      if(response.data) {
        const authToken = response.data.authToken;

        if (authToken) {

          this.authToken = authToken;

          const expiresIn = response.data.expiresIn;
          this.setAuthTimer(expiresIn);

          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          this.isAdmin = response.data.userDetails.isAdmin;
          this.adminStatusListener.next(this.isAdmin);

          this.userId = response.data.userId;
          this.userIdListener.next(this.userId);


          this.userFullName = response.data.userDetails.fullName;
          this.fullNameListener.next(this.userFullName);


          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);

          this.socketService.setUser(this.authToken);
          this.socketService.verifyUser(this.authToken);
          this.socketService.toastSuccess("Your account was created successfully");

          this.saveAuthData(authToken, expirationDate, this.userId, this.userFullName, this.isAdmin);


          if (this.isAdmin == true) {
            this.appRouter.navigate(['/dashboard']);
          } else {
            this.appRouter.navigate(['/planner', response.data.userId]);
          }
        }
      } else {
        this.socketService.toastError(response.message);
        console.log(response);
      }
      
    }, (error) => {
      console.log(error);
    });
    
  }


  loginUser(email: string, password: string) {
    let loginData = {email: email, password: password};

    this.http.post<ResponseData>(`${this.baseUrl}/login`, loginData)
    .subscribe((response) => {
      console.log(response);
      if(response.status == 201) {
        const authToken = response.data.authToken;
        if (authToken) {
          this.authToken = authToken;

          const expiresIn = response.data.expiresIn;
          this.setAuthTimer(expiresIn);

          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          this.isAdmin = response.data.userDetails.isAdmin;
          this.adminStatusListener.next(this.isAdmin);

          this.userId = response.data.userId;
          this.userIdListener.next(this.userId);


          this.userFullName = response.data.userDetails.fullName;
          this.fullNameListener.next(this.userFullName);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);

          this.socketService.setUser(this.authToken);
          this.socketService.verifyUser(this.authToken);

          this.saveAuthData(authToken, expirationDate, this.userId, this.userFullName, this.isAdmin);

          this.socketService.toastSuccess("Login successful");

          if (this.isAdmin == true) {
            this.appRouter.navigate(['/dashboard']);
          } else {
            this.appRouter.navigate(['/planner', response.data.userId]);
          }
        }
      } else {
        this.socketService.toastError("Login error");
      }
      
    }, (error) => {
      console.log(error);
      this.socketService.toastError("Login error");
    });
  }


  findUserName(username: string) {
    return this.http.post<ResponseData>(`${this.baseUrl}/check/username`, username);
  }


  getSingleUser(userId) {
    return this.http.get<ResponseData>(`${this.baseUrl}/${userId}`);
  }


  getAllUserList() {
    this.http.get<ResponseData>(`${this.baseUrl}/all`)
    .subscribe((response) => {
      if(response.status == 200) {
        if(response.data) {
          this.allUsers = response.data;
          this.allUsersListener.next([...this.allUsers]);
        } else {
          this.allUsers = null;
          this.allUsersListener.next(null);
        }
        
      }
    }, (error) => {
      console.log(error);
    });
  }


  getAllAdminUsers() {
    this.http.get<ResponseData>(`${this.baseUrl}/all/admin`)
    .subscribe((response) => {
      if(response.status == 200) {
        if(response.data) {
          this.allAdminUsers = response.data;
          this.allAdminUsersListener.next([...this.allAdminUsers]);
        } else {
          this.allAdminUsers = null;
          this.allAdminUsersListener.next(null);
        }
        
      } else {
        console.log(response.message);
      }
    }, (error) => {
      console.log(error);
    });
  }


  getAllNormalUsers() {
    this.http.get<ResponseData>(`${this.baseUrl}/all/normal`)
    .subscribe((response) => {
      if(response.status == 200) {
        if(response.data) {
          this.allNormalUsers = response.data;
          this.allNormalUsersListener.next([...this.allNormalUsers]);
        } else {
          this.allNormalUsers = null;
          this.allNormalUsersListener.next(null);
        }
        
      } else {
        console.log(response.message);
      }
    }, (error) => {
      console.log(error);
    });
  }


  resetPasswordRequest(email) {
    let data = {email: email};
    return this.http.post<ResponseData>(`${this.baseUrl}/recover/password`, data);
  }


  changePassword(password: string, authToken: string) {
    let data = {
      password: password
    };

    this.http.put<ResponseData>(`${this.baseUrl}/reset/password/${authToken}`, data)
    .subscribe((response) => {
      console.log(response);
      if(response.status == 201) {
        this.appRouter.navigate(['/login']);
      } else {
        this.socketService.toastError(response.message);
      }
    }, (error) => {
      console.log(error);
    });
  }


  logout() {
    let data = {
      authToken: this.authToken
    };
    this.http.post<ResponseData>(`${this.baseUrl}/logout`, data)
    .subscribe((response) => {
      this.authToken = null;
      this.isAuthenticated = false;
      this.authStatusListener.next(false);
      this.userId = null;
      this.removeAuthData();
      clearTimeout(this.tokenTimer);
      this.appRouter.navigate(['/login']);
      this.socketService.toastSuccess("Logout successful");
      
    }, (error) => {
      console.log(error);
        this.socketService.toastError("Logout error");
    });
  }

  getAllAdminCount() {
    return this.http.get<ResponseData>(`${this.baseUrl}/count/admin`);
  }

  getAllNormalUsersCount() {
    return this.http.get<ResponseData>(`${this.baseUrl}/count/user`);
  }


}
