import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { User } from '@app/core/interfaces/user.interface';

import { environment as env } from '@env/environment';

/**
 * @title Table retrieving data through HTTP
 */
@Component({
  selector: 'app-list',
  styleUrls: ['./list.component.scss'],
  templateUrl: './list.component.html',
})
export class ListComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'firstname',
    'lastname',
    'email',
    'age',
    'details',
    'update',
    'delete',
  ];
  apiDatabase: ApiHttpDatabase | null;
  data: User[] = [];

  resultsLength = 0;
  itemsxpage = 10;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private subscriptions: Subscription[] = [];

  constructor(private httpClient: HttpClient, public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.apiDatabase = new ApiHttpDatabase(this.httpClient);

    // If the user changes the sort order, reset back to the first page.
    this.subscriptions.push(
      this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0))
    );

    this.subscriptions.push(
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            return this.apiDatabase.getUsers(
              this.sort.active,
              this.sort.direction,
              this.paginator.pageIndex,
              this.paginator.pageSize
            );
          }),
          map((data) => {
            // Flip flag to show that loading has finished.
            this.isLoadingResults = false;
            this.isRateLimitReached = false;
            this.resultsLength = data.total;

            return data.items;
          }),
          catchError(() => {
            this.isLoadingResults = false;
            // Catch if the GitHub API has reached its rate limit. Return empty data.
            this.isRateLimitReached = true;
            return observableOf([]);
          })
        )
        .subscribe((data) => (this.data = data))
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }
}

interface ApiUsers {
  items: User[];
  total: number;
}

/** An api database that the data source uses to retrieve data for the table. */
export class ApiHttpDatabase {
  constructor(private httpClient: HttpClient) {}

  getUsers(
    sortBy: string,
    order: string,
    page: number,
    limit: number
  ): Observable<ApiUsers> {
    let sort = sortBy;
    if (order === 'asc') {
      sort = `-${sortBy}`;
    }

    return this.httpClient.get<ApiUsers>(
      `${env.apiURL}/user?offset=${page}&limit=${limit}&order=${sort}`
    );
  }
}
