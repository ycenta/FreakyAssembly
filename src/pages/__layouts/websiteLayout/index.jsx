import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './WebsiteLayout.module.scss';

export default function WebsiteLayout() {
  const { pathname } = useLocation();

  return (
    <div className={ `${styles.WebsiteLayout}` }>
      <Suspense fallback="Loading...">
        <div className={styles.WebsiteLayoutContent}>
          <Outlet />
        </div>
        <footer></footer>
      </Suspense>
    </div>
  );
}