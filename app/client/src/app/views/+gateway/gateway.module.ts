import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
import { DetailsModalComponent } from './details-modal/details-modal.component';
import { ManagmentDevicesModalComponent } from './managment-devices-modal/managment-devices-modal.component';


const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    data: {title: 'Gateway list'},
  },
  {
    path: 'add',
    component: AddComponent,
    data: {title: 'Gateway add'},
  },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [IndexComponent, AddComponent, DetailsModalComponent, ManagmentDevicesModalComponent],
  entryComponents: [
    DetailsModalComponent,
    ManagmentDevicesModalComponent
  ],
})
export class GatewayModule {}
