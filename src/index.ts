import express, { Request, Response } from "express";
import {
  createRangeArray,
  hasNoRemainder,
  reckonClient,
  stringSearch,
} from "./utils/utils";

const app = express();

interface Divisor {
  divisor: number;
  output: string;
}

interface TestTwoResult {
  candidate: string;
  text: string;
  results: Array<{ subtext: string; result: string }>;
}

app.get("/", async function testOne(req: Request, res: Response) {
  const range = await reckonClient.get("/test1/rangeInfo");
  const divisorsResponse = await reckonClient.get("/test1/divisorInfo");

  let responseString = "";

  const { lower, upper } = range.data;
  const divisors: Array<Divisor> = divisorsResponse.data.outputDetails;

  for (let i of createRangeArray(lower, upper)) {
    responseString += `${i}: ${divisors
      .filter((d) => hasNoRemainder(i, d.divisor))
      .map((divisor) => divisor.output)
      .join("")} \n`;
  }

  return res.send(responseString);
});

app.post("/test2", async function testTwo(req: Request, res: Response) {
  const { data: textData } = await reckonClient.get("/test2/textToSearch");
  const { data: subTextData } = await reckonClient.get("/test2/subTexts");

  const textToSearch = textData.text?.toLocaleLowerCase();

  const resultsDictionary = stringSearch(textToSearch, subTextData.subTexts);

  const result: TestTwoResult = {
    candidate: "Denniel Joshua T. Diaz",
    text: textData.text,
    results: Object.entries(resultsDictionary).map(([key, value]) => ({
      subtext: key,
      result: value.reduce((str, current) => str + ", " + current),
    })),
  };

  const submitResponse = await reckonClient.post(
    "/test2/submitResults",
    result
  );

  return res.json({
    submittedData: result,
    response: submitResponse.data,
  });
});

app.listen(9999, () =>
  console.log("🚀 Server running on: http://localhost:9999")
);
