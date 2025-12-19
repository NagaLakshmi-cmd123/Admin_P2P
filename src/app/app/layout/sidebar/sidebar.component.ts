import { CommonModule } from '@angular/common';
import { Component,Input,Output,EventEmitter, Signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone:true,
  imports: [RouterModule,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  //  @Input() isOpen: boolean = false;
    @Input() isOpen!: boolean; // <- pass the signal itself

  @Output() close = new EventEmitter<void>();

  onLinkClick() {
    this.close.emit(); // Auto-close sidebar on click
  }
}
