import { useState, useEffect } from "react";

function useRandomNumber() {
  const [ number, setNumber ] = useState<number>();

  useEffect(
    () => {
      fetch(process.env.API_URL!)
        .then(response => response.text())
        .then(text => setNumber(+text));
    },
    []
  );

  return number;
}

const Home = () => {
  const number = useRandomNumber();
  return (
    <p>
      Random Number: {number}
    </p>
  )
};

export default Home