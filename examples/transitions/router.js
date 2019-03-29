import ListPage from "./ListPage";
import DetailPage from "./DetailPage";
import { Router } from "plume-core";

const routes = [
    {
        path: "/",
        component: ListPage
    },
    {
        path: "/detail",
        component: DetailPage
    }
];

export default new Router({ routes });
