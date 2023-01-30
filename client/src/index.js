import React from "react";
import { createRoot, ApolloProvider, InMemoryCache } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";

// ✅ correct ID passed
const rootElement = document.getElementById("root")
const root = createRoot(rootElement)

root.render(<App />);


