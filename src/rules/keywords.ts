import type {Rule} from "../lib/rule"
import {unlessClippy} from "../lib/skip"
import {FieldType} from "../lib/field"

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

export default {
	type: FieldType.Direct,
	rules
}
