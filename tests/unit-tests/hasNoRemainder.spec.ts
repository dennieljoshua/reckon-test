import "jest";
import { hasNoRemainder } from "../../src/utils/utils";

describe("hasNoRemainer", () => {
  it("should return false if one of the params is 0", () => {
    const result = hasNoRemainder(0, 1);

    expect(result).toBe(false);
  });

  it("should return true if n divided by divisor has no remainer", () => {
    const result = hasNoRemainder(3, 3);

    expect(result).toBe(true);
  });

  it("should return false if there is remainder", () => {
    const result = hasNoRemainder(1, 3);

    expect(result).toBe(false);
  });
});
