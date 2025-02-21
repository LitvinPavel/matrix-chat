import { createRouter, createWebHistory, type RouteMeta } from "vue-router";
import LoginPage from "@/views/LoginPage.vue";
import ListViewPage from "@/views/ListViewPage.vue";

function isAuth() {
  const accessToken = localStorage.getItem("matrix_access_token"),
    baseUrl = localStorage.getItem("matrix_base_url"),
    userId = localStorage.getItem("matrix_user");
  return !!(accessToken && baseUrl && userId);
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: LoginPage,
    },
    {
      path: "/",
      name: "List",
      component: ListViewPage,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record: { meta: RouteMeta }) => record.meta.requiresAuth)) {
    if (!isAuth()) {
      next({ name: "Login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
