import type {Rule} from "../lib/rule"
import {FieldType} from "../lib/field"
import * as Rules from "../lib/rule"

let rules: Rule[] = [
	{
		rule: "must be a string",
		test: value => typeof value == "string",
	},
	{
		rule: "must not be an empty string",
		test: value => Boolean(value && value.length > 0)
	},
	{
		rule: "must be short",
		test: value => Boolean(value && value.length < 200),
	},
]

export default {
	type: FieldType.Direct,
	rules
}
