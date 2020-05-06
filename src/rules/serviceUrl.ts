import type {Rule} from "../lib/rule"
import * as skips from "../lib/skips"

let rules: Rule[] = [
	{
		rule: "must not be present if project is not a service",
		skip: skips.ifService,
		test: value => value === undefined,
	},
	{
		rule: "must be a url if project is a service",
		skip: skips.unlessService,
		test: value => {
			try {
				let url = new URL(value)
				return url.protocol == "http:" || url.protocol == "https:"
			} catch {
				return false
			}
		},
	},
]

export default rules
