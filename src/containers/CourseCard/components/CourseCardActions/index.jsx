import React from 'react';
import PropTypes from 'prop-types';

import { ActionRow } from '@openedx/paragon';

import { reduxHooks } from 'hooks';

import UpgradeButton from './UpgradeButton';
import SelectSessionButton from './SelectSessionButton';
import BeginCourseButton from './BeginCourseButton';
import ResumeButton from './ResumeButton';
import ViewCourseButton from './ViewCourseButton';
import messages from './messages';
export const CourseCardActions = ({ cardId }) => {
  const { isEntitlement, isFulfilled } = reduxHooks.useCardEntitlementData(cardId);
  const {
    isVerified,
    hasStarted,
    isExecEd2UCourse,
  } = reduxHooks.useCardEnrollmentData(cardId);
  const { isArchived } = reduxHooks.useCardCourseRunData(cardId);
  const { isPassing } = reduxHooks.useCardGradeData(cardId);
  let actionButton;
  if (isEntitlement) {
    actionButton = isFulfilled
      ? <ViewCourseButton cardId={cardId} />
      : <SelectSessionButton cardId={cardId} />;
  } else if (isArchived && !isEntitlement) {
    actionButton = isPassing
      ? <ViewCourseButton cardId={cardId} forceDisabled />
      : <ViewCourseButton cardId={cardId} forceDisabled text={messages.dueCourse} />;
  } else if (!(isArchived || isEntitlement)) {
    if (hasStarted) {
      actionButton = isPassing
        ? <BeginCourseButton cardId={cardId} buttonMessages={messages.viewCourse} />
        : <ResumeButton cardId={cardId} />;
    } else {
      actionButton = <BeginCourseButton cardId={cardId} buttonMessages={messages.beginCourse} />;
    }
  }
  return (
    <ActionRow data-test-id="CourseCardActions">
      {/* {!(isEntitlement || isVerified || isExecEd2UCourse) && <UpgradeButton cardId={cardId} />}
      {isEntitlement && (isFulfilled
        ? <ViewCourseButton cardId={cardId} />
        : <SelectSessionButton cardId={cardId} />
      )}

      {(isArchived && !isEntitlement) && (isFulfilled
        ? <ViewCourseButton cardId={cardId} forceDisabled />
        : <ViewCourseButton cardId={cardId} forceDisabled text={messages.dueCourse} />
      )}
      {!(isArchived || isEntitlement) && (hasStarted
        ? (isPassing? <BeginCourseButton cardId={cardId} buttonMessages={messages.viewCourse} />:<ResumeButton cardId={cardId} />)
        : <BeginCourseButton cardId={cardId} buttonMessages={messages.beginCourse} />
      )} */}
      {actionButton}
    </ActionRow>
  );
};
CourseCardActions.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseCardActions;
