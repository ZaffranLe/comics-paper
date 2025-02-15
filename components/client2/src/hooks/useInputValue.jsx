import { useEffect, useState } from "react";

/**
 * A state using useState hooks with a filter included
 *
 * @param {*} predicate a predicate to test whether the value is true or not
 *
 * @returns the getter, setter, and a boolean statement of the
 *  condition when is valid or not
 */
export function useInputValue(predicate, cause) {
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && value === "") {
      console.warn(`The value is empty, the disable is enable`);
    }
    if (predicate && !predicate(value)) {
      console.warn(cause);
    }
    setDisabled(
      value !== "" && (predicate !== undefined ? predicate(value) : true),
    );
  }, [value]);

  return [value, setValue, disabled, cause];
}
