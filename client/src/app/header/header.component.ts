import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionType, Page, ViewType } from '../utils/common/enums';
import { SharedService } from '../services/shared.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [FormsModule],
  standalone: true
})
export class HeaderComponent {
  ActionType = ActionType;
  ViewType = ViewType;
  Page = Page;
  searchValue = '';
  selectedView: ViewType = ViewType.List;
  @Input() page: Page = Page.List;
  @Input() planetName = '';
  @Output() planetAction = new EventEmitter<ActionType>();
  @Output() changeView = new EventEmitter<ViewType>();

  constructor(private sharedService: SharedService) {}

  firePlanetAction(actionType: ActionType) {
    this.planetAction.emit(actionType);
  }

  selectView(viewType: ViewType) {
    this.selectedView = viewType;
    this.changeView.emit(viewType);
  }
  search() {
    this.sharedService.searchingSubject.next(this.searchValue);
  }
}
