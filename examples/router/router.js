import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import NotFoundPage from "./NotFoundPage";
import ProductPage from "./ProductPage";
import { Router } from "plume-core";

const routes = [
    {
        path: "/",
        component: HomePage
    },
    {
        path: "/about",
        component: AboutPage
    },
    {
        path: "*",
        component: NotFoundPage
    },
    {
        path: "/product/:id",
        component: ProductPage
    }
];

export default new Router({ routes });
