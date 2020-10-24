import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
})
export class UpdateComponent implements OnInit, OnDestroy {
  updateForm: FormGroup;
  loading = false;

  userID: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.updateForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.userID = this.activatedRoute.snapshot.paramMap.get('uuid');

    if (this.userID) {
      this.subscriptions.push(
        this.userService.getOneById(this.userID).subscribe(
          (data) => {
            this.updateForm.setValue({
              firstname: data.firstname,
              lastname: data.lastname,
              age: data.age,
              email: data.email
            });
          },
          (err) => {
            this.snackBar.open(`User not found by ID ${this.userID}`);
            this.updateForm.disable();
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

  onUpdate(): void {
    this.loading = true;

    if (this.updateForm.valid) {
      this.updateForm.disable();

      this.subscriptions.push(
        this.userService
          .update(this.userID, {
            age: this.updateForm.value.age,
            email: this.updateForm.value.email,
            firstname: this.updateForm.value.firstname,
            lastname: this.updateForm.value.lastname,
          })
          .subscribe(
            (data) => {
              this.router.navigate(['']);
            },
            (response: HttpErrorResponse) => {
              this.updateForm.enable();
              this.loading = false;

              this.snackBar.open(response.error.message, 'X', {
                duration: 3000,
              });
            }
          )
      );
    } else {
      this.loading = false;
      console.log('Form not valid');
    }
  }
}
