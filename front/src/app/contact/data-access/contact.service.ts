import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../model/contact.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient) {}

  getMessages(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl);
  }

  getMessage(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }

  createMessage(message: Partial<Contact>): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, message);
  }

  updateMessageStatus(id: number, status: 'new' | 'read' | 'replied'): Observable<Contact> {
    return this.http.patch<Contact>(`${this.apiUrl}/${id}`, { status });
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}