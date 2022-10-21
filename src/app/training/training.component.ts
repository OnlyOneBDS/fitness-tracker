import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromTraining from '../state/training.reducer';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {
  onGoingTraining$: Observable<boolean>;

  constructor(private store: Store<fromTraining.State>) { }

  ngOnInit(): void {
    this.onGoingTraining$ = this.store.select(fromTraining.getIsTraining);
  }
}
