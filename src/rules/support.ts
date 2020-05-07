import type {Rule} from "../lib/rule"
import {FieldType} from "../lib/field"
import {unlessClippy} from "../lib/skip"

let rules: Rule[] = [
	{
		rule: "must be a string",
		test: value => typeof value == "string",
	},
	{
		rule: "should be a financial times github issues URL",
		skip: unlessClippy,
		test: value =>
			typeof value == "string" &&
			Boolean(
				value.match(
					/^https:\/\/github.com\/Financial-Times\/[a-z0-9-]+\/issues\/?$/i
				)
			),
	},
]

export default {
	type: FieldType.Direct,
	rules
}
