import React from "react";
import { Error } from "./components/Error/Error";
import { Loading } from "./components/Loading/Loading";
import { PeopleList } from "./components/PeopleList/PeopleList";
import { SearchInput } from "./components/SearchInput/SearchInput";
import { usePeopleQuery } from "./hooks/usePeopleQuery";

export function PeopleSearchPage() {
  const [query, setQuery] = React.useState("");
  const { data, isLoading, isError } = usePeopleQuery({ query });
  const timerRef = React.useRef(null);

  const onChange = (event) => {
    const value = event.target.value;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setQuery(value);
    }, 300);
  };

  return (
    <div className="my-14">
      <SearchInput onChange={onChange} />
      {isLoading ? <Loading /> : null}
      {isError ? <Error /> : null}
      <PeopleList data={data} isLoading={isLoading} isError={isError} />
    </div>
  );
}
