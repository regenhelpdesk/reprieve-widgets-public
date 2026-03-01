import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RemoteCommandComponent } from './remote-command/remote-command.component';



@NgModule({
  declarations: [
    RemoteCommandComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule
  ],
  exports: [
    RemoteCommandComponent
  ]
})
export class CommandManagerWidgetModule { }
