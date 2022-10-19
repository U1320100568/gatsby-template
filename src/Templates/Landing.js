import React from "react";
import {AppContext} from "../AppContext";

export default function Landing (props) {
  const { pageContext } = props;
  const ctx = React.useContext(AppContext);

  return (
    <div>
      <h1>My website template</h1>
      <h3>Gatsby 3.4.1</h3>
      <div>theme: {ctx.theme}</div>
      <button onClick={() => ctx.actions.toggle()}>switch</button>
    </div>
  )
}