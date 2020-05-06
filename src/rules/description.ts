import type {Rule} from "../lib/rule"

let rules: Rule[] = [
	{
		rule: "must be a string",
		test: value => typeof value == "string",
	},
	{
		rule: "must not be an empty string",
		test: value => value && value.length > 0,
	},
	{
		rule: "must be short",
		test: value => value && value.length < 200,
	},
]

export default rules
