import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";

export function createMockPinia() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
}

export async function renderWithProviders(
  component,
  { props = {}, route = "/", routes, pinia = createMockPinia(), global = {} } = {}
) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: routes || [{ path: "/:pathMatch(.*)*", component: { template: "<div />" } }],
  });
  router.push(route);
  await router.isReady();
  const wrapper = mount(component, {
    props,
    global: { ...global, plugins: [pinia, router, ...(global.plugins || [])] },
  });
  return { wrapper, router, pinia };
}
