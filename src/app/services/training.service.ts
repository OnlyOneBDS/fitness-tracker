import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subscription, take } from 'rxjs';

import { Store } from '@ngrx/store';
import { Exercise } from '../models/exercise';
import * as Training from '../state/training.actions';
import * as fromTraining from '../state/training.reducer';
import * as UI from '../state/ui.actions';
import { UIService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private firebaseSubs: Subscription[] = [];

  constructor(private afs: AngularFirestore, private uiService: UIService, private store: Store<fromTraining.State>) { }

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());

    this.firebaseSubs
      .push(this.afs
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return docArray.map(doc => {
              return {
                id: doc.payload.doc.id,
                ...doc.payload.doc.data() as Exercise
              };
            });
          })
        )
        .subscribe({
          next: (exercises: Exercise[]) => {
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
          },
          error: error => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackBar('Fetching exercises failed, please try again later', null, 3000);
          }
        }));
  }

  fetchUserExerciseHistory() {
    this.firebaseSubs
      .push(this.afs
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        }));
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe(exercise => {
        this.addDataToDb({
          ...exercise,
          date: new Date(),
          state: 'completed'
        });

        this.store.dispatch(new Training.StopTraining());
      });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe(exercise => {
        this.addDataToDb({
          ...exercise,
          duration: exercise.duration * (progress / 100),
          calories: exercise.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled'
        });

        this.store.dispatch(new Training.StopTraining());
      });
  }

  cancelSubscriptions() {
    this.firebaseSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDb(exercise: Exercise) {
    this.afs.collection('finishedExercises').add(exercise);
  }
}
