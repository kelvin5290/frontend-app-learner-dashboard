import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "@edx/frontend-platform/i18n";
import { Pagination, Stack, Chip, Form } from "@openedx/paragon";
import { ActiveCourseFilters } from "containers/CourseFilterControls";
import CourseCard from "containers/CourseCard";
import { reduxHooks } from "hooks";
import { useIsCollapsed } from "./hooks";
import messages from "../messages";
import { getLocale } from '@edx/frontend-platform/i18n';
export const CourseList = ({
  filterOptions,
  setPageNumber,
  numPages,
  showFilters,
  visibleList,
}) => {
  const isCollapsed = useIsCollapsed();
  const pageNumber = reduxHooks.usePageNumber();
  const { formatMessage } = useIntl();
  const lanMap = { C: "zh", P: "ch", E: "en", T: "th" ,Y: "ms"};
  const flanMap = { "zh-hk":"C","zh-cn":"P","en": "E","th":"T","ms-my":"Y" };
  const lanSelect = reduxHooks.useLanSelect().sort((a, b) => {
    if (a === 'E' || b === 'E') {
      return -1;
    }
    const messageA = messages[lanMap[a]]
      ? messages[lanMap[a]].defaultMessage
      : "";
    const messageB = messages[lanMap[b]]
      ? messages[lanMap[b]].defaultMessage
      : "";
    return messageA.localeCompare(messageB);
  });
  const filter = reduxHooks.useLanFilter();
  const setFilter = reduxHooks.useSetLanFilter();
  React.useEffect(() => {
   let lan =  getLocale()
  //  console.log("lan", lan)
   setFilter(flanMap[lan])
  }, []);
  return (
    <>
      
      {showFilters && (
        <div id="course-list-active-filters-container">
          <ActiveCourseFilters {...filterOptions} />
        </div>
      )}
      {!isCollapsed ? (
        <div className="d-flex flex-column flex-grow-1 mb-2">
          <Stack gap={2} direction="horizontal">
            <span className="chipFilter">
              {formatMessage(messages.courseLanguage)}
            </span>
            <Chip
            className="chip"
              isSelected={filter === "all"}
              onClick={() => {
                setFilter("all");
                setPageNumber(1);
              }}
            >
              {formatMessage(messages.all)}
            </Chip>
            {lanSelect.map((lan) => {
              const message = messages[lanMap[lan]];
              return message ? (
                <Chip
                className="chip"
                  key={lan}
                  isSelected={filter === lan}
                  onClick={() => { setFilter(lan); setPageNumber(1); }}
                >
                  {formatMessage(message)}
                </Chip>
              ) : null;
            })}
          </Stack>
        </div>
      ) : (
        <div className="d-flex flex-column flex-grow-1 mt-4">
          <Form.Group controlId="courseLanguage">
            <Form.Control
              value={filter}
              id="courseLanguage"
              onChange={(e) => {
                setFilter(e.target.value);
                setPageNumber(1);
              }}
              name={formatMessage(messages.courseLanguage)}
              as="select"
              floatingLabel={formatMessage(messages.courseLanguage)}
            >
              <option value="all">{formatMessage(messages.all)}</option>
              {lanSelect.map((lan) => {
                const message = messages[lanMap[lan]];
                return message ? (
                  <option value={lan}>{formatMessage(message)}</option>
                ) : null;
              })}
            </Form.Control>
          </Form.Group>
        </div>
      )}
      <div className="course-pagination">
      {numPages > 1 && (
        <Pagination
          
          variant={isCollapsed ? "reduced" : "secondary"}
          paginationLabel="Course List"
          className="mx-auto mb-2"
          pageCount={numPages}
          currentPage={pageNumber}
          onPageSelect={setPageNumber}
        />
      )}
       </div>
       <div className="d-flex flex-column flex-grow-1">
        {visibleList.map(({ cardId }) => (
          <CourseCard key={cardId} cardId={cardId} />
        ))}
         </div>
         <div className="course-pagination">
        {numPages > 1 && (
          <Pagination
            variant={isCollapsed ? "reduced" : "secondary"}
            paginationLabel="Course List"
            className="mx-auto mb-2"
            style={{marginLeft: "-15px !important"}}
            pageCount={numPages}
            currentPage={pageNumber}
            onPageSelect={setPageNumber}
          />
        )}
     </div>
    </>
  );
};

CourseList.propTypes = {
  showFilters: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  visibleList: PropTypes.arrayOf(PropTypes.object).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  filterOptions: PropTypes.object.isRequired,
  numPages: PropTypes.number.isRequired,
  setPageNumber: PropTypes.func.isRequired,
};

export default CourseList;
