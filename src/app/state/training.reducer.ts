import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Exercise } from "../models/exercise";
import * as fromRoot from '../state/app.reducer';
import { SET_AVAILABLE_TRAININGS, SET_FINISHED_TRAININGS, START_TRAINING, STOP_TRAINING, TrainingActions } from "./training.actions";

export interface State extends fromRoot.State {
  training: TrainingState;
}

export interface TrainingState {
  activeTraining: Exercise;
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
}

const initialState: TrainingState = {
  activeTraining: null,
  availableExercises: [],
  finishedExercises: []
};

export function trainingReducer(state = initialState, action: TrainingActions): TrainingState {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS:
      return {
        ...state,
        availableExercises: action.payload
      };
    case SET_FINISHED_TRAININGS:
      return {
        ...state,
        finishedExercises: action.payload
      };
    case START_TRAINING:
      return {
        ...state,
        activeTraining: { ...state.availableExercises.find(ex => ex.id === action.payload) }
      };
    case STOP_TRAINING:
      return {
        ...state,
        activeTraining: null
      };
    default:
      return state;
  }
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');

export const getActiveTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining);
export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const getIsTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining !== null);