import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Planet } from '../utils/common/interfaces';
import { PlanetsService } from '../services/planets.service';
import { SharedService } from '../services/shared.service';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { ActionType } from '../utils/common/enums';

@Component({
  selector: 'app-planet-actions',
  templateUrl: './planet-actions.component.html',
  styleUrl: './planet-actions.component.scss',
  imports: [ReactiveFormsModule, ConfirmationPopupComponent],
  standalone: true
})
export class PlanetActionsComponent {
  planetForm: FormGroup;
  selectedFile: File | null = null;
  isOpenedConfirmationPopup = false;
  action: ActionType = ActionType.Create;
  ActionType = ActionType;
  @Input() planet: Planet | null = null;
  @Output() closeDialog = new EventEmitter<boolean>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  constructor(private fb: FormBuilder, private planetsService: PlanetsService, private sharedService: SharedService) {
    // Comment: add errors to this form
    this.planetForm = this.fb.group({
      planetName: ['', Validators.required],
      description: ['', Validators.required],
      planetRadiusKM: [null, [Validators.required, Validators.min(0)]],
      planetColor: ['', Validators.required],
      distInMillionsKM: this.fb.group({
        fromSun: this.fb.control(0, [Validators.required, Validators.min(0)]),
        fromEarth: this.fb.control(0, Validators.min(0)),
      }),
    });
  }

  ngOnInit() {
    if (this.planet && this.planet.id) {
      this.action = ActionType.Edit;
      this.planetForm.patchValue(this.planet);
      this.getFileFromUrl();
    }
  }

  async getFileFromUrl() {
    if (this.planet?.imageUrl)
      this.selectedFile = await this.planetsService.urlToFile(this.planet.imageUrl, this.planet.imageName || '');
  }

  openFileSelector() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  save() {
    switch (this.action) {
      case ActionType.Create:
        this.createPlanet();
        break;
      case ActionType.Edit:
        this.editPlanet();
        break;
      default:
        this.close();
        break;
    }
  }

  createPlanet() {
    const data: Planet = this.planetForm.value;
    this.planetsService.createPlanet(data, this.selectedFile).subscribe(createdPlanet => {
      if (createdPlanet) {
        this.close(true);
      }
    });
  }

  editPlanet() {
    const data: Planet = this.planetForm.value;
    if (this.planet?.id) {
      this.planetsService.editPlanet(this.planet?.id, data, this.selectedFile).subscribe(createdPlanet => {
        if (createdPlanet) {
          this.close(true);
        }
      });
    }
  }

  closePopup(isConfirmed: boolean) {
    if (isConfirmed) {
      this.save();
    } else {
      this.close();
    }
  }

  close(isSaved = false) {
    this.closeDialog.emit(isSaved);
  }
}
