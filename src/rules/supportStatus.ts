import type {Rule} from "../lib/rule"

let statuses = ["active", "maintained", "deprecated", "dead", "experimental"]

let rules: Rule[] = [
	{
		rule: `must be one of: ${statuses.join(" ")}`,
		test: value => statuses.includes(value),
	},
]

export default rules
