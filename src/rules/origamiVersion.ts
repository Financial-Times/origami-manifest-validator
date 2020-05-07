import type {Rule} from "../lib/rule"
import {FieldType} from "../lib/field"

let rules: Rule[] = [
	{
		rule: "must be `1`",
		test: value => value === 1,
	},
]

export default {
	type: FieldType.Direct,
	rules
}
