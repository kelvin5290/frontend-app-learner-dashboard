import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { MenuIcon, Close } from '@openedx/paragon/icons';
import { IconButton, Icon } from '@openedx/paragon';
import siteLanguageList from '../../../site-language/constants'
import { useLearnerDashboardHeaderData, useIsCollapsed } from '../hooks';
import { Button,Form } from '@openedx/paragon';
import CollapseMenuBody from './CollapseMenuBody';
import AuthenticatedUserDropdown from '../ExpandedHeader/AuthenticatedUserDropdown';
import BrandLogo from '../BrandLogo';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import messages from '../messages';
import { publish } from '@edx/frontend-platform';
import { convertKeyNames, snakeCaseObject } from '@edx/frontend-platform/utils';
import { getLocale, handleRtl, LOCALE_CHANGED } from '@edx/frontend-platform/i18n';
import { Menu, MenuTrigger, MenuContent } from './Menu';
import Avatar from './Avatar';
export const CollapsedHeader = () => {
  const { formatMessage } = useIntl();
  const isCollapsed = useIsCollapsed();
  const { isOpen, toggleIsOpen } = useLearnerDashboardHeaderData();
  const { username, userId,avatar} = getAuthenticatedUser();
  const handleChange = async (e) => {
    e.preventDefault();
    const requestConfig = { headers: { 'Content-Type': 'application/merge-patch+json' } };
    const { username, userId } = getAuthenticatedUser();
    let processedParams = snakeCaseObject({ prefLang: e.target.value });
    processedParams = convertKeyNames(processedParams, {
      pref_lang: 'pref-lang',
    });
  
    await getAuthenticatedHttpClient()
      .patch(`${getConfig().LMS_BASE_URL}/api/user/v1/preferences/${username}`, processedParams, {
        headers: { 'Content-Type': 'application/merge-patch+json' },
      });
      
    const formData = new FormData();
    formData.append('language', e.target.value);
    try {
      await getAuthenticatedHttpClient()
        .post(`${getConfig().LMS_BASE_URL}/i18n/setlang/`, formData, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        }).catch();
       } catch (e) {
          console.log(e)
        }
      publish(LOCALE_CHANGED, e.target.value);
      handleRtl();
      location.reload()
  };
  return (
    isCollapsed && (
      <>
        <header className="d-flex shadow-sm align-items-center learner-variant-header">
          <IconButton
            invertColors
            isActive
            src={isOpen ? Close : MenuIcon}
            iconAs={Icon}
            alt={
              isOpen
                ? formatMessage(messages.collapseMenuOpenAltText)
                : formatMessage(messages.collapseMenuClosedAltText)
            }
            onClick={toggleIsOpen}
            variant="primary"
            className="p-4"
          />
          <BrandLogo />
          <Form.Group controlId="language" className='mt-3'>
        <Form.Control value={getLocale()} id='language' onChange={(e)=>{handleChange(e)}}  name={formatMessage(messages.language)}  as="select" floatingLabel={formatMessage(messages.language)}>
       { siteLanguageList.map(({ code, name }) => (<option  value={code}>{name}</option>))}
          </Form.Control>
          </Form.Group>
          <AuthenticatedUserDropdown />
          {/* <Menu tag="nav" aria-label={formatMessage(messages.headerNav)} className="position-static">
              <MenuTrigger
                tag="button"
                className="icon-button"
                aria-label={formatMessage(messages.headerMenu)}
                title={formatMessage(messages.headerMenu)}
              >
                <Avatar size="1.5rem" alt={username} />
              </MenuTrigger>
              <MenuContent tag="ul" className="nav flex-column pin-left pin-right border-top shadow py-2">

        <li className="nav-item" key={`settings`}>
          <a
            className={`nav-link active`}
            href={`${getConfig().LMS_BASE_URL}/account/settings`}
            
          >
            {formatMessage(messages.account)}
          </a>
        </li>
        <li className="nav-item" key={`signOut`}>
          <a
            className={`nav-link active`}
            href={getConfig().LOGOUT_URL}
          >
            {formatMessage(messages.signOut)}
          </a>
        </li>
              </MenuContent>
            </Menu> */}
        </header>
        <CollapseMenuBody isOpen={isOpen} />
      </>
    )
  );
};

CollapsedHeader.propTypes = {};

export default CollapsedHeader;
