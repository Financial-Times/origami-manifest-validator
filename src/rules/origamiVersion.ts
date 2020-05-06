import type {Rule} from "../lib/rule"

let rules: Rule[] = [
	{
		rule: "must be `1`",
		test: value => value === 1,
	},
]

export default rules
