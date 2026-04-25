import { useRouterState } from "@tanstack/react-router";
import styles from "./Layout.module.scss";

export function Layout({ children }) {
  const { location } = useRouterState();

  return (
    <main className={styles.main}>
      <div key={location.pathname} className={styles.page}>
        {children}
      </div>
    </main>
  );
}
