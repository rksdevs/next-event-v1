"use client"; // This ensures that the Redux Provider is handled on the client

import { Provider } from "react-redux";
import store from "./store";

export default function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
