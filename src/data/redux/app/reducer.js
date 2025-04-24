import { createSlice } from '@reduxjs/toolkit';

import { StrictDict } from 'utils';

const initialState = {
  pageNumber: 1,
  courseData: {},
  entitlement: [],
  courseMeta: {},
  emailConfirmation: {},
  enterpriseDashboard: {},
  platformSettings: {},
  suggestedCourses: [],
  selectSessionModal: {},
  filters: [],
  lanFilter: "all",
};

export const cardId = (val) => `card-${val}`;

export const today = Date.now();

/**
 * Creates a redux slice with actions to load dashboard data and manage visual layout
 */
const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    loadCourses: (state, { payload: { courses } }) => ({
      ...state,
      courseData: courses.reduce(
        (obj, curr, index) => {
          const out = { ...curr, cardId: cardId(index) };
          if (out.enrollment.lastEnrolled === null) {
            out.enrollment.lastEnrolled = today;
          }
          return { ...obj, [cardId(index)]: out };
        },
        {},
      ),
    }),
    loadCoursesMeta: (state, { payload }) => ({
      ...state,
      courseMeta: payload,
    }),
    loadGlobalData: (state, { payload }) => ({
      ...state,
      emailConfirmation: payload.emailConfirmation,
      enterpriseDashboard: payload.enterpriseDashboard,
      platformSettings: payload.platformSettings,
      suggestedCourses: payload.suggestedCourses,
      socialShareSettings: payload.socialShareSettings,
    }),
    updateSelectSessionModal: (state, { payload }) => ({
      ...state,
      selectSessionModal: { cardId: payload },
    }),
    setPageNumber: (state, { payload }) => ({ ...state, pageNumber: payload }),
    setFilters: (state, { payload }) => ({
      ...state,
      filters: payload,
    }),
    setLanFilter: (state, { payload }) => ({
      ...state,
      lanFilter: payload,
    }),
    addFilter: (state, { payload }) => ({
      ...state,
      filters: [...state.filters, payload],
    }),
    removeFilter: (state, { payload }) => ({
      ...state,
      filters: state.filters.filter(item => item !== payload),
    }),
    clearFilters: (state) => ({
      ...state,
      filters: [],
    }),
  },
});

const actions = StrictDict(app.actions);

const { reducer } = app;

export {
  actions,
  initialState,
  reducer,
};
