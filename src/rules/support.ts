import type {Rule} from "../lib/rule"
import {unlessClippy} from "../lib/skips"

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

export default rules
