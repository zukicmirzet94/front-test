import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionType } from '../utils/common/enums';

interface PopupActionText {
  header: string;
  body: string;
}

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.scss',
  standalone: true
})
export class ConfirmationPopupComponent {
  @Input() type: ActionType | null = null;
  @Input() planetName = '';
  @Output() closePopup = new EventEmitter<boolean>();
  popupActionText: PopupActionText = {
    header: '',
    body: ''
  }
  ngOnInit() {
    this.getActionText();
  }

  getActionText() {
    switch (this.type) {
      case ActionType.Create:
        this.popupActionText = {
          header: 'creating',
          body: 'create'
        }
        break;
      case ActionType.Edit:
        this.popupActionText = {
          header: 'editing',
          body: 'edit'
        }
        break;
      case ActionType.Delete:
        this.popupActionText = {
          header: 'deleting',
          body: 'delete'
        }
        break;
      default:
        this.close();
        break;
    }
  }

  close(isConfirmed = false) {
    this.closePopup.emit(isConfirmed);
  }
}
