import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Profile {
  userId: string;
  phoneNumber: string;
  dateOfBirth: Date;
}

export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  getUserProfile(userId: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/${userId}/profile`);
  }

  updateProfile(userId: string, profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/${userId}/profile`, profile);
  }

  addAddress(userId: string, address: Address): Observable<Address> {
    return this.http.post<Address>(`${this.apiUrl}/${userId}/addresses`, address);
  }

  updateAddress(addressId: string, address: Address): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/addresses/${addressId}`, address);
  }

  deleteAddress(addressId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/addresses/${addressId}`);
  }

  setDefaultAddress(userId: string, addressId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${userId}/addresses/${addressId}/default`, {});
  }
}