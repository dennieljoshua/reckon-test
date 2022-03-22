import "jest";
import { stringSearch } from "../../src/utils/utils";

describe("really bad string search algo", () => {
  it("should return <No Output> if no match found", () => {
    const resultDict = stringSearch("banana is a fruit", ["z"]);

    expect(resultDict["z"]).toEqual(["<No Output>"]);
  });

  it("should return a string array of matched patterns", () => {
    const resultDict = stringSearch("aaabaaacaaa", ["aaa"]);

    expect(resultDict["aaa"].length).toEqual(3);
    expect(resultDict["aaa"]).toEqual(["1", "5", "9"]);
  });
});
