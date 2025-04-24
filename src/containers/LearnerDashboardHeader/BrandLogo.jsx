import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';

import { reduxHooks } from 'hooks';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import messages from './messages';

export const BrandLogo = () => {
  const { formatMessage } = useIntl();
  const dashboard = reduxHooks.useEnterpriseDashboardData();
  const { authenticatedUser } = React.useContext(AppContext);
  let userDomain = ''
  const [imgSrc, setImgSrc] = React.useState(null);
  React.useEffect(() => {
    if (userDomain) {
      setImgSrc(`https://d2ttnbhfjsw4ca.cloudfront.net/${userDomain}.png`);
    }
  }, [userDomain]);
  if (authenticatedUser !== undefined) {
    userDomain = authenticatedUser.email.split("@")[1].replaceAll(".", "_");
  }

  return (
    <a  href={dashboard?.url || '/'} className="mx-auto d-flex flex-row">
      <img
        className="logo py-3"
        src={getConfig().LOGO_URL}
        alt={formatMessage(messages.logoAltText)}
      />
       {userDomain && (
    <img
      className="logo py-3 ml-2"
      onError={i =>{ setImgSrc("");}}
      src={imgSrc}
    />
  )}
    </a>

  );
};

BrandLogo.propTypes = {};

export default BrandLogo;
