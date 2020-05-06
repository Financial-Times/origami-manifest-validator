import type {Rule} from "../lib/rule"
import {unlessClippy} from "../lib/skips"

let rules: Rule[] = [
	{
		rule: "should be an array",
		skip: unlessClippy,
		test: Array.isArray
	},
	{
		rule: "must be an array or a string",
		test: value => typeof value == "string" || Array.isArray(value)
	}
]

export default rules
