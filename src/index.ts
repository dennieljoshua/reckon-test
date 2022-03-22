import express, { Request, Response } from "express";
import { createRangeArray, hasNoRemainder, reckonClient } from "./utils/utils";

const app = express();

interface Divisor {
  divisor: number;
  output: string;
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

app.listen(9999, () =>
  console.log("🚀 Server running on: http://localhost:9999")
);
