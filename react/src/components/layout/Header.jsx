import { Link, useRouterState } from "@tanstack/react-router";
import styles from "./Header.module.scss";

export function Header() {
  const { location } = useRouterState();
  const isHome = location.pathname === "/";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          react<span>.</span>
        </Link>
        {!isHome && (
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>
              ← Exercises
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
