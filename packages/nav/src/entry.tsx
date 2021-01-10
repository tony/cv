import "preact/debug";
import { h, render } from "preact";

const App = () => {
  return <strong>Test of Tony Narlock's resume</strong>;
};

render(<App />, document.getElementById("nav"));
