import { createSelector } from 'reselect';

import { StrictDict } from 'utils';

import simpleSelectors from './simpleSelectors';
import * as module from './appSelectors';

export const numCourses = createSelector(
  [simpleSelectors.courseData],
  (courseData) => Object.keys(courseData).length,
);
export const lanSelect = createSelector(
  [simpleSelectors.courseData],
  (courseData) => [...new Set(Object.values(courseData).map((course) => course.course.courseNumber.slice(-1)))]);
export const hasCourses = createSelector([module.numCourses], (num) => num > 0);
export const hasAvailableDashboards = createSelector(
  [simpleSelectors.enterpriseDashboard],
  (data) => data !== null && data.isLearnerPortalEnabled === true,
);
export const showSelectSessionModal = createSelector(
  [simpleSelectors.selectSessionModal],
  (data) => data.cardId != null,
);

export default StrictDict({
  numCourses,
  hasCourses,
  lanSelect,
  hasAvailableDashboards,
  showSelectSessionModal,
});
