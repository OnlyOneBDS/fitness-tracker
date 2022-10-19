import { NgModule } from '@angular/core';

import { CurrentTrainingComponent } from '../training/current-training/current-training.component';
import { StopTrainingComponent } from '../training/current-training/stop-training.component';
import { NewTrainingComponent } from '../training/new-training/new-training.component';
import { PastTrainingsComponent } from '../training/past-trainings/past-trainings.component';
import { TrainingComponent } from '../training/training.component';
import { SharedModule } from './shared.module';
import { TrainingRoutingModule } from './training-routing.module';

@NgModule({
  declarations: [
    CurrentTrainingComponent,
    NewTrainingComponent,
    PastTrainingsComponent,
    StopTrainingComponent,
    TrainingComponent
  ],
  imports: [
    SharedModule,
    TrainingRoutingModule
  ]
})
export class TrainingModule { }
