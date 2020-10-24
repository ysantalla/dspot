import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '@app/core/interfaces/user.interface';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  userID: string;
  user: User;

  loading: boolean;

  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) { }

  ngOnInit(): void {

    this.userID = this.activatedRoute.snapshot.paramMap.get('uuid');

    if (this.userID) {
      this.loading = true;
      this.subscriptions.push(
        this.userService.getOneById(this.userID).subscribe(
          (data) => {
            this.user = data;
            this.loading = false;
          },
          (err) => {
            this.snackBar.open(`User not found by ID ${this.userID}`);
            this.loading = false;
          }
        )
      );
    } else {
      this.snackBar.open(`Invalid ID`);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }

}
