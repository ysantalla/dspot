import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { GatewayService } from '../services/gateway.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  addForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private gatewayService: GatewayService
  ) { }

  ngOnInit() {

    // Pattern to validate IP address https://www.w3resource.com/javascript/form/ip-address-validation.php
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      serialNumber: ['', Validators.required],
      ipAddress: ['', Validators.pattern('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')]
    });
  }

  onAdd(): void {

    this.loading = true;

    if (this.addForm.valid) {
      this.addForm.disable();

      this.gatewayService.addGateway({
        name: this.addForm.value.name,
        ipAddress: this.addForm.value.ipAddress,
        serialNumber: this.addForm.value.serialNumber,
      }).subscribe(
        (data) => {
          this.router.navigate(['']);
        },
        (response: HttpErrorResponse) => {
          this.addForm.enable();
          this.loading = false;

          this.snackBar.open(response.error.message, 'X', {duration: 3000});
        }
      );

    } else {
      this.loading = false;
      console.log('Form not valid');
    }

  }

}
