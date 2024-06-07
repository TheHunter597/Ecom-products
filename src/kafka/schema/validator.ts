import * as validator from "jsonschema";
import * as fs from "fs";

const ProductCreatedSchema: validator.Schema = JSON.parse(
  fs.readFileSync(`${__dirname}/productCreatedSchema.json`, {
    encoding: "utf8",
    flag: "r",
  })
);
export default function validate(data: any, type: string) {
  let result = validator.validate(JSON.parse(data), ProductCreatedSchema);

  if (result.errors.length > 0) {
    throw new Error("Invalid data for " + type);
  }
}
