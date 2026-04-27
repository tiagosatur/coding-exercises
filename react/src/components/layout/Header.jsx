import { Link, useRouterState } from "@tanstack/react-router";
import { exercises } from "@exercises/config";
import styles from "./Header.module.scss";

export function Header() {
  const { location } = useRouterState();
  const { pathname } = location;
  const isHome = pathname === "/";

  const currentExercise = exercises.find((ex) =>
    pathname.startsWith(`/${ex.slug}/`)
  );

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

            {currentExercise && (
              <>
                <span className={styles.navSeparator} />
                {currentExercise.links.map((link) => {
                  const isActive = pathname.startsWith(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
