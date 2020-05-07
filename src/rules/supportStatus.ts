import type {Rule} from "../lib/rule"
import {FieldType} from "../lib/field"

let statuses = ["active", "maintained", "deprecated", "dead", "experimental"]

let rules: Rule[] = [
	{
		rule: `must be one of: ${statuses.join(" ")}`,
		test: value => statuses.includes(value),
	},
]

export default {
	type: FieldType.Direct,
	rules
}
