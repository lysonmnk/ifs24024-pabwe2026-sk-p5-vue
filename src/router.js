import { createRouter, createWebHistory } from "vue-router";
import { getAccessToken } from "./helpers/apiHelper.js";
import AuthLayout from "./features/auth/layouts/AuthLayout.vue";
import LoginPage from "./features/auth/pages/LoginPage.vue";
import RegisterPage from "./features/auth/pages/RegisterPage.vue";
import NotFoundPage from "./features/common/pages/NotFoundPage.vue";

// Lazy load halaman yang hanya diakses setelah login (optimasi bundle size)
const AucationLayout = () =>
  import("./features/aucations/layouts/AucationLayout.vue");
const HomePage = () => import("./features/aucations/pages/HomePage.vue");
const DetailPage = () => import("./features/aucations/pages/DetailPage.vue");
const UsersPage = () => import("./features/users/pages/UsersPage.vue");
const ProfilePage = () => import("./features/users/pages/ProfilePage.vue");

export const guestOnly = () => (getAccessToken() ? "/" : true);
export const authOnly = () => (getAccessToken() ? true : "/auth/login");

export const routes = [
  {
    path: "/auth",
    component: AuthLayout,
    beforeEnter: guestOnly,
    children: [
      { path: "", redirect: "/auth/login" },
      { path: "login", component: LoginPage },
      { path: "register", component: RegisterPage },
    ],
  },
  {
    path: "/",
    component: AucationLayout,
    beforeEnter: authOnly,
    children: [
      { path: "", component: HomePage },
      { path: "aucations/:aucationId", component: DetailPage },
      { path: "users", component: UsersPage },
      { path: "profile", component: ProfilePage },
    ],
  },
  { path: "/:pathMatch(.*)*", component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
