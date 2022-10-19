import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Exercise } from 'src/app/models/exercise';
import { TrainingService } from 'src/app/services/training.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  isLoading = true;

  private exerciseSub: Subscription;
  private loadingSub: Subscription;

  constructor(private trainingService: TrainingService, private uiService: UIService) {
  }

  ngOnInit(): void {
    this.loadingSub = this.uiService
      .loadingStateChanged
      .subscribe(isLoading => {
        this.isLoading = isLoading;
      });

    this.exerciseSub = this.trainingService
      .exercisesChanged
      .subscribe(exercises => {
        this.exercises = exercises
      });

    this.fetchExercises();
  }

  ngOnDestroy(): void {
    if (this.exerciseSub) {
      this.exerciseSub.unsubscribe();
    }

    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }


  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
