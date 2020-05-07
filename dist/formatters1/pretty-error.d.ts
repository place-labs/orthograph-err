import { TextlintMessage, TextlintResult } from "@textlint/types";
import { FormatterOptions } from "../FormatterOptions";
/**
 *
 * @param {string} code
 * @param {string} filePath
 * @param {TextLintMessage} message
 * @returns {*}
 */
declare function prettyError(code: string, filePath: string, message: TextlintMessage): any;
/**
 *
 * @param {TextLintResult[]} results
 * @param {TextLintFormatterOption} options
 * @returns {string}
 */
declare function formatter(results: TextlintResult[], options: FormatterOptions): any;
export default formatter;
export { prettyError };
