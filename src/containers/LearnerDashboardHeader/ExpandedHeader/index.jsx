import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button,Form } from '@openedx/paragon';
import siteLanguageList from '../../../site-language/constants'
import urls from 'data/services/lms/urls';
import { reduxHooks } from 'hooks';
import {useRef} from 'react';
import AuthenticatedUserDropdown from './AuthenticatedUserDropdown';
import { useIsCollapsed, findCoursesNavClicked } from '../hooks';
import messages from '../messages';
import BrandLogo from '../BrandLogo';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { publish } from '@edx/frontend-platform';
import { convertKeyNames, snakeCaseObject } from '@edx/frontend-platform/utils';
import { getLocale, handleRtl, LOCALE_CHANGED } from '@edx/frontend-platform/i18n';
export const ExpandedHeader = () => {
  const { formatMessage } = useIntl();
  const { courseSearchUrl } = reduxHooks.usePlatformSettingsData();
  const isCollapsed = useIsCollapsed();
  const ref = useRef(null)
  const exploreCoursesClick = findCoursesNavClicked(
    urls.baseAppUrl(courseSearchUrl),
  );

  if (isCollapsed) {
    return null;
  }
  console.log(getLocale())
  const handleChange = async (e) => {
    e.preventDefault();
    let language = e.target.value;
    console.log("language",language)
    const requestConfig = { headers: { 'Content-Type': 'application/merge-patch+json' } };
    const { username, userId } = getAuthenticatedUser();
    let processedParams = snakeCaseObject({ prefLang: language });
    processedParams = convertKeyNames(processedParams, {
      pref_lang: 'pref-lang',
    });
  
    await getAuthenticatedHttpClient()
      .patch(`${getConfig().LMS_BASE_URL}/api/user/v1/preferences/${username}`, processedParams, {
        headers: { 'Content-Type': 'application/merge-patch+json' },
      });
      
    const formData = new FormData();
    formData.append('language', language);
    try {
      await getAuthenticatedHttpClient()
        .post(`${getConfig().LMS_BASE_URL}/i18n/setlang/`, formData, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        }).catch();
       } catch (e) {
          console.log(e)
        }
      publish(LOCALE_CHANGED, language);
      handleRtl();
      location.reload()
  };
  return (
    <header className="d-flex shadow-sm align-items-center learner-variant-header pl-4">
      <div className="flex-grow-1 d-flex align-items-center">
        <BrandLogo />

        <Button
          as="a"
          href="/"
          variant="inverse-primary"
          className="p-4 course-link"
        >
          {formatMessage(messages.course)}
        </Button>
        {/* <Button
          as="a"
          href={urls.programsUrl()}
          variant="inverse-primary"
          className="p-4"
        >
          {formatMessage(messages.program)}
        </Button>
        <Button
          as="a"
          href={urls.baseAppUrl(courseSearchUrl)}
          variant="inverse-primary"
          className="p-4"
          onClick={exploreCoursesClick}
        >
          {formatMessage(messages.discoverNew)}
        </Button> */}
        <span className="flex-grow-1" />
        
          <Form.Group controlId="language" className='mt-3'>
        <Form.Control value={getLocale()} id='language' onChange={(e)=>{handleChange(e)}}  name={formatMessage(messages.language)}  as="select" floatingLabel={formatMessage(messages.language)}>
       { siteLanguageList.map(({ code, name }) => (<option  value={code}>{name}</option>))}
          </Form.Control>
          </Form.Group>
          
          
        {/* <Button
          as="a"
          href={getConfig().SUPPORT_URL}
          variant="inverse-primary"
          className="p-4"
        >
          {formatMessage(messages.help)}
        </Button> */}
      </div>

      <AuthenticatedUserDropdown />
    </header>
  );
};

ExpandedHeader.propTypes = {};

export default ExpandedHeader;
