import clippyTest from "../lib/clippy-test"
import type {Rule} from "../lib/rule"

let rules: Rule[] = [
	{
		rule: "should be an array",
		skip: clippyTest,
		test: Array.isArray
	},
	{
		rule: "must be an array or a string",
		test: value => typeof value == "string" || Array.isArray(value)
	}
]

export default rules
