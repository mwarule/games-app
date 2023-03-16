import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from "rxjs";
import { User } from "src/app/common/models/user";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userSubject!: BehaviorSubject<User | null>;
  public user!: Observable<User | null>;
  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<User>(`/api/auth/signin`, { username, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }


  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  register(user: User) {
    return this.http.post(`${environment.API_URL}/api/auth/signup`, user);
  }

  getAll() {
    return this.http.get<User[]>(`${environment.API_URL}/users`);
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.API_URL}/users/${id}`);
  }
}
