/* eslint-disable @next/next/no-img-element */
import styles from '../../styles/modules/Header.module.css';
import Link from 'next/link';
import Logo from '../../asset/logo-colored-no-background.svg';
import { Dropdown, Menu } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';

export const Header = ({ activePage, setActivePage }) => {
  const exploreMenu = (
    <Menu
      onClick={(e) => handleNavItemClick(e, 2)}
      onMouseEnter={() => updateSlider(2)}
      onMouseLeave={() => updateSlider(activePage)}
    >
      <Menu.Item key='promises'>
        <Link href='/explore-promises'>
          <a>Explore promises</a>
        </Link>
      </Menu.Item>
      <Menu.Item key='twitterHandles'>
        <Link href='/explore-twitter-verified'>
          <a>Verified Twitter accounts</a>
        </Link>
      </Menu.Item>
    </Menu>
  );

  const updateSlider = (i) => {
    const root = document.querySelector(':root');
    root.style.setProperty('--tab-nav-current-item', i);
  };

  const handleNavItemClick = (e, i) => {
    updateSlider(i);
    setActivePage(i);

    if (e && i === 0) smoothScrollTo(e.target.attributes.to.value);
  };

  const smoothScrollTo = (target) => {
    // Make sure the activePage page is '/' and not '/explore-promises' or '/user-dashboard'
    if (typeof window === 'undefined') return;
    if (window.location.pathname !== '/') return;

    document.querySelector(target).scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    updateSlider(activePage);
  }, [activePage]);

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <Link href='/'>
          <a
            onClick={() => {
              smoothScrollTo('.section-home');
              handleNavItemClick(null, 0);
            }}
            className={styles.logo}
          >
            <img src={Logo.src} alt='logo' className='custom-img' />
          </a>
        </Link>
      </div>
      <TabNav>
        <Link href='/'>
          <a
            className={activePage === 0 ? 'active' : ''}
            onClick={(e) => handleNavItemClick(e, 0)}
            onMouseEnter={() => updateSlider(0)}
            onMouseLeave={() => updateSlider(activePage)}
            to='.section-about'
          >
            The project
          </a>
        </Link>
        <Link href='https://docs.usepromise.xyz/'>
          <a
            onMouseEnter={() => updateSlider(1)}
            onMouseLeave={() => updateSlider(activePage)}
            target='_blank'
            style={{ display: 'flex', gap: '0.5rem' }}
          >
            <i className='fas fa-book'></i>Docs
          </a>
        </Link>
        <Dropdown
          overlay={exploreMenu}
          selectable={true}
          placement='bottomLeft'
          trigger={['hover']}
        >
          <a
            className={
              activePage === 2 ? 'active dropdown-title' : 'dropdown-title'
            }
            onMouseEnter={() => updateSlider(2)}
            onMouseLeave={() => updateSlider(activePage)}
          >
            <span>Explore</span> <i className='fas fa-chevron-down' />
          </a>
        </Dropdown>
        <Link href='/user-dashboard'>
          <a
            className={activePage === 3 ? 'active' : ''}
            onClick={(e) => handleNavItemClick(e, 3)}
            onMouseEnter={() => updateSlider(3)}
            onMouseLeave={() => updateSlider(activePage)}
          >
            Dashboard
          </a>
        </Link>
        <ConnectButton
          label='Connect'
          showBalance={false}
          showNetwork={false}
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'avatar',
          }}
          chainStatus={{
            smallScreen: 'icon',
            largeScreen: 'full',
          }}
        />
      </TabNav>
    </header>
  );
};

const TabNav = ({ children, className }) => {
  useEffect(() => {
    const root = document.querySelector(':root');
    root.style.setProperty('--tab-nav-items', children.length);
  }, [children]);
  return (
    <div className={[styles.links, className].join(' ')}>
      {children}
      <div className={styles.slider} role='presentation'></div>
    </div>
  );
};
