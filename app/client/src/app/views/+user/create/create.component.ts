import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  addForm: FormGroup;
  loading = false;

  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }

  onAdd(): void {
    this.loading = true;

    if (this.addForm.valid) {
      this.addForm.disable();

      this.subscriptions.push(
        this.userService
          .create({
            age: this.addForm.value.age,
            email: this.addForm.value.email,
            firstname: this.addForm.value.firstname,
            lastname: this.addForm.value.lastname,
          })
          .subscribe(
            (data) => {
              this.router.navigate(['']);
            },
            (response: HttpErrorResponse) => {
              this.addForm.enable();
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
