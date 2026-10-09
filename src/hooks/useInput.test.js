import { useInput } from "./useInput.js";

describe("useInput", () => {
  it("menyimpan nilai awal dan mengubahnya", () => {
    const [value, onChange, setValue] = useInput("a");
    expect(value.value).toBe("a");
    onChange({ target: { value: "b" } });
    expect(value.value).toBe("b");
    setValue("c");
    expect(value.value).toBe("c");
  });
  it("default kosong", () => {
    expect(useInput()[0].value).toBe("");
  });
});
