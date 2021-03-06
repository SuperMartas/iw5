import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientDetailModel } from '../api/models';
import { IngredientService } from '../api/services';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.less']
})
export class IngredientComponent implements OnInit {

  constructor(
    private ingredientService: IngredientService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  @Output() newIngredientCreated = new EventEmitter<void>();
  @ViewChild('ingredientComponent') form: any;

  loadIngredientError = false;
  editMode = false;
  errorMessage = '';
  model: IngredientDetailModel = { description: '', name: '' };

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    if (id !== undefined) {
      const request = { id };

      this.ingredientService.ingredientGetById(request).subscribe(
        providedIngredient => this.model = providedIngredient,
        error => this.loadIngredientError = true);

      this.editMode = true;
    }
  }

  onSave(): void {
    if (this.model !== undefined) {
      const model = this.model;
      const request = { body: model };

      if (model.id !== undefined) {
        this.ingredientService.ingredientUpdate(request).subscribe();
      }
      else {
        this.ingredientService.ingredientCreate(request).subscribe(
          complete => {
            this.model = { description: '', name: '' };
            this.form.reset();
            this.newIngredientCreated.emit();
          }
        );

      }
    }
  }

  onDelete(): void {
    if (this.model?.id !== undefined) {
      const id: string = this.model.id;
      const request = { id };

      this.ingredientService.ingredientDelete(request).subscribe(complete => this.router.navigate(['/ingredients']));
    }
  }
}
