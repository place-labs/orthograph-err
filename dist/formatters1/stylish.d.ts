/**
 * @fileoverview Stylish reporter
 * @author Sindre Sorhus
 */
import { TextlintResult } from "@textlint/types";
import { FormatterOptions } from "../FormatterOptions";
declare function formatter(results: TextlintResult[], options: FormatterOptions): any;
export default formatter;
