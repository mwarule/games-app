import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from "../models/game";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(
    private http: HttpClient
  ) {
  }

  getAll(): Observable<Game[]> {
    return this.http.get<Game[]>(`${environment.API_URL}games`);
  }
}
