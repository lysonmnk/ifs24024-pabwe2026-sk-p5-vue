import { ref } from "vue";

/** Composable untuk two-way binding input: const [value, onChange, setValue] = useInput("") */
export function useInput(initialValue = "") {
  const value = ref(initialValue);
  const onChange = (event) => {
    value.value = event.target.value;
  };
  const setValue = (next) => {
    value.value = next;
  };
  return [value, onChange, setValue];
}
