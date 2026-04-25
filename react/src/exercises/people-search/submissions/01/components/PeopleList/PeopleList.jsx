import { PersonCard } from "../PersonCard/PersonCard";
import styles from "./PeopleList.module.scss";


export function PeopleList({
  isLoading,
  isError,
  data,
}) {
  if (isLoading || isError) return null;

  return (
    <div className={styles.grid}>
      {data.data?.map((person, index) => (
        <PersonCard key={index} person={person} index={index} />
      ))}
    </div>
  );
}
