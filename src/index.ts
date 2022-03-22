import express, { Request, Response } from "express";
import { createRangeArray, hasNoRemainder, reckonClient } from "./utils/utils";

const app = express();

interface Divisor {
  divisor: number;
  output: string;
}

interface TestTwoResponse {
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

  const resultsDictionary: { [subText: string]: Array<number | string> } = {};

  for (const subText of subTextData.subTexts) {
    const normalized: string = subText.toLocaleLowerCase();

    for (let i = 0; i < textToSearch.length; i++) {
      for (let j = 0; j < normalized.length; j++) {
        const subChar = normalized[j];

        if (subChar !== textToSearch[i + j]) {
          break;
        }

        if (j === normalized.length - 1) {
          console.log(`Matched ${normalized} starting at index: ${i}`);
          if (!Array.isArray(resultsDictionary[subText])) {
            resultsDictionary[subText] = [];
          }
          resultsDictionary[subText].push(i + 1);
        }
      }
    }

    // No match
    if (!Array.isArray(resultsDictionary[subText])) {
      resultsDictionary[subText] = ["<No Output>"];
    }
  }

  const response: TestTwoResponse = {
    candidate: "Denniel Joshua T. Diaz",
    text: textData.text,
    results: Object.entries(resultsDictionary).map(([key, value]) => ({
      subtext: key,
      result: value.toString(),
    })),
  };

  return res.json(response);
});

app.listen(9999, () =>
  console.log("🚀 Server running on: http://localhost:9999")
);
