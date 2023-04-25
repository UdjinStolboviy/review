import {StrictMode} from "react";
import {createRoot} from "react-dom/client";

import Table from "./Table";
import issues from "./issues";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <Table issues={issues} />
    </StrictMode>
);
