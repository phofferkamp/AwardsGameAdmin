import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

declare const CONFIG: any;

@Injectable()
export class APIService {
  constructor(public http: Http) {
  }

  private get headerAdminOptions() {
    let headers = new Headers({
      'token': CONFIG.API_ADMIN_USERNAME,
    });
    return new RequestOptions({ headers: headers });
  }
  
  private get headerUserOptions() {
    let headers = new Headers({
      'token': CONFIG.API_USER_USERNAME,
    });
    return new RequestOptions({ headers: headers });
  }

  getCategories(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(CONFIG.API_URL + CONFIG.GAME_ROUTE + '/category', this.headerUserOptions)
        .map(res => res.json())
        .subscribe(res => resolve(res)
        , (err) => reject(err)
        );
    });
  }

  addCategory(category: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(CONFIG.API_URL + CONFIG.GAME_ROUTE + '/category', category, this.headerAdminOptions)
        .map(res => res.json())
        .subscribe(res => resolve(res)
        , (err) => reject(err)
        );
    });
  }

  deleteCategory(category: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(CONFIG.API_URL + CONFIG.GAME_ROUTE + '/category/' + category._id, this.headerAdminOptions)
        .map(res => res.json())
        .subscribe(res => resolve(res)
        , (err) => reject(err)
        );
    });
  }

  updateCategory(category: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(CONFIG.API_URL + CONFIG.GAME_ROUTE + '/category/' + category._id, category, this.headerAdminOptions)
        .map(res => res.json())
        .subscribe(res => resolve(res)
        , (err) => reject(err)
        );
    });
  }
  
  getUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(CONFIG.API_URL + CONFIG.GAME_ROUTE + '/user', this.headerAdminOptions)
        .map(res => res.json())
        .subscribe(res => resolve(res)
        , (err) => reject(err)
        );
    });
  }
  
  getUser(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(CONFIG.API_URL + CONFIG.GAME_ROUTE + '/admin/' + user.name + '/' + user.password, this.headerUserOptions)
        .map(res => res)
        .subscribe(res => resolve(res)
        , (err) => reject(err)
        );
    });
  }

  addUser(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(CONFIG.API_URL + CONFIG.GAME_ROUTE + '/user', user, this.headerUserOptions)
        .map(res => res.json())
        .subscribe(res => resolve(res)
        , (err) => reject(err)
        );
    });
  }
  
  updateUser(id, user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(CONFIG.API_URL + CONFIG.GAME_ROUTE + '/user/' + id, user, this.headerUserOptions)
        .map(res => res.json())
        .subscribe(res => resolve(res)
        , (err) => reject(err)
        );
    });
  }

  deleteUser(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(CONFIG.API_URL + CONFIG.GAME_ROUTE + '/user/' + user._id, this.headerAdminOptions)
        .map(res => res.json())
        .subscribe(res => resolve(res)
        , (err) => reject(err)
        );
    });
  }
  
  getGames(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(CONFIG.API_URL + CONFIG.GAME_ROUTE + '/game', this.headerUserOptions)
        .map(res => res.json())
        .subscribe(res => resolve(res)
        , (err) => reject(err)
        );
    });
  }
  
  getGame(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(CONFIG.API_URL + CONFIG.GAME_ROUTE + '/game/' + user.name, this.headerUserOptions)
        .map(res => res.json())
        .subscribe(res => resolve(res)
        , (err) => reject(err)
        );
    });
  }
  
  updateGame(game: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(CONFIG.API_URL + CONFIG.GAME_ROUTE + '/game/' + game._id, game, this.headerAdminOptions)
        .map(res => res.json())
        .subscribe(res => resolve(res)
        , (err) => reject(err)
        );
    });
  }
  
  getFeedback(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(CONFIG.API_URL + CONFIG.GAME_ROUTE + '/feedback', this.headerAdminOptions)
        .map(res => res.json())
        .subscribe(res => resolve(res)
        , (err) => reject(err)
        );
    });
  }
  
  deleteFeedback(feedback: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(CONFIG.API_URL + CONFIG.GAME_ROUTE + '/feedback/' + feedback._id, this.headerAdminOptions)
        .map(res => res.json())
        .subscribe(res => resolve(res)
        , (err) => reject(err)
        );
    });
  }
  
  getConfig(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(CONFIG.API_URL + CONFIG.GAME_ROUTE + '/config', this.headerUserOptions)
        .map(res => res.json())
        .subscribe(res => resolve(res)
        , (err) => reject(err)
        );
    });
  }
  
  updateConfig(config: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(CONFIG.API_URL + CONFIG.GAME_ROUTE + '/config/' + config._id, config, this.headerAdminOptions)
        .map(res => res.json())
        .subscribe(res => resolve(res)
        , (err) => reject(err)
        );
    });
  }
}