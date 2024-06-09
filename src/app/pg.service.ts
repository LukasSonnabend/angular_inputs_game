import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PGService {

  constructor() { 
    this.getConnectionString();
  }

  getConnectionString(): void {
    let connectionString = localStorage.getItem('connectionString');
    if (!connectionString) {
      connectionString = window.prompt('Please enter the database connection string:');
      localStorage.setItem('connectionString', connectionString ?? '');
    }
  }
}
