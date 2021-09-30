import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class FromCalendarService {
  private reservedDays: number[] = [];
  private reservedDaysUpdated = new Subject<{ reservedDays: number[] }>();

  constructor(private http: HttpClient) {}

  getReservedDays(year: number, month: number): void {
    const queryParams = `?year=${year}&month=${month}`;
    this.http.get<{days: number[]}[]>('http://localhost:3000/admin/bookings/reserved-days' + queryParams)
     .subscribe((reservedDays) => {
        const reservedPeriods = reservedDays.map(reservedPeriod => {
          return reservedPeriod.days;
        });
        this.reservedDays = [].concat.apply([], reservedPeriods);
        this.reservedDaysUpdated.next({
          reservedDays: [...this.reservedDays],
        });
      });
  }

  getReservedDaysUpdateListener(){
    return this.reservedDaysUpdated.asObservable();
  }
}
