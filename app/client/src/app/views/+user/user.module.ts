import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateComponent } from './update/update.component';
import { CreateComponent } from './create/create.component';
import { DetailsComponent } from './details/details.component';
import { DeleteComponent } from './delete/delete.component';


const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    data: {title: 'User list'},
  },
  {
    path: 'user/create',
    component: CreateComponent,
    data: {title: 'User create'},
  },
  {
    path: 'user/:uuid/update',
    component: UpdateComponent,
    data: {title: 'User update'},
  },
  {
    path: 'user/:uuid/details',
    component: DetailsComponent,
    data: {title: 'User details'},
  },
  {
    path: 'user/:uuid/delete',
    component: DeleteComponent,
    data: {title: 'Delete User'},
  }
];

@NgModule({
  declarations: [ListComponent, UpdateComponent, CreateComponent, DetailsComponent, DeleteComponent],
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class UserModule { }
