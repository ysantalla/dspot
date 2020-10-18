import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GatewayService } from '../services/gateway.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Gateway } from '@app/core/interfaces/gateway.interface';

@Component({
  selector: 'app-details-modal',
  templateUrl: './details-modal.component.html',
  styleUrls: ['./details-modal.component.scss'],
})
export class DetailsModalComponent implements OnInit {
  loading: boolean;

  gateway: Gateway;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private gatewayService: GatewayService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.gatewayService.getOneGateway(this.data.gatewayID).subscribe(
      (data) => {
        this.gateway = data;
        this.loading = false;
      },
      (response: HttpErrorResponse) => {
        this.loading = false;
        this.snackBar.open('Loading error', 'X', { duration: 3000 });
      }
    );
  }
}
