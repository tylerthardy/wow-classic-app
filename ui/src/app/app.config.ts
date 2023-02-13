import { Injectable } from '@angular/core';

@Injectable()
export class AppConfig {
  public apiUrl: string;

  constructor() {
    // this.apiUrl = 'https://6zdrton9kb.execute-api.us-east-1.amazonaws.com/prod';
    this.apiUrl = 'http://localhost:3000';
  }
}
