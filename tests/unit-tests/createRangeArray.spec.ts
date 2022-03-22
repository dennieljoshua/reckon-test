import "jest";
import { createRangeArray } from "../../src/utils/utils";

describe("createRangeArray", () => {
  it("should generate an array", () => {
    const range = createRangeArray(1, 5);

    expect(Array.isArray(range)).toBe(true);
  });

  it("should generate an array inclusive of start and end", () => {
    const range = createRangeArray(5, 10);

    expect(range[0]).toBe(5);
    expect(range.pop()).toBe(10);
  });
});
