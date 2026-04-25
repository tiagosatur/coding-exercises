import styles from "./PersonCard.module.scss";

const ACCENT_COUNT = 4;

export function PersonCard({ person, index }) {
  const accentClass = styles[`accent-${(index % ACCENT_COUNT) + 1}`];
  const birthDate = Intl.DateTimeFormat('pt-BR').format(new Date(person.birthday));
  const about = person.about?.slice(0, 60);

  return (
    <article className={styles.card}>
      <div className={`${styles.avatar} ${accentClass}`}>
        <img src={person.images.jpg.image_url} />
      </div>
      <p className={styles.name}>{person.name}</p>
      <p className={styles.meta}>{birthDate} | {person.favorites}</p>
      {person.about ? <p className={styles.about} title={person.about}>{about}...</p> : null}
    </article>
  );
}
