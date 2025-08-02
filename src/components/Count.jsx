import React, { useState } from "react";

const Count = () => {
  const [count, setCount] = useState(0);

  const handlePlusCount = () => {
    setCount(count + 1);
  };

  const handleMinusCount = () => {
    setCount(count - 1);
  };
  return (
    <>
      <h1>{count}</h1>
      <button onClick={handlePlusCount}>+</button>
      <button onClick={handleMinusCount}>-</button>
    </>
  );
};

export default Count;
