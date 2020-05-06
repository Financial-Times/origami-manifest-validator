import {TestingLevel} from "../lib/testing-level"
import type {Rule} from "../lib/rule"

let origamiTypes = [
	"component",
	"module",
	"imageset",
	"service",
	"cli",
	"library",
	"website",
	"config",
	"example",
	"meta",
	null,
]

let rules: Rule[] = [
	{
		rule: `must be one of: ${origamiTypes.join(" ")}or null`,
		test: value => origamiTypes.includes(value),
	},
	{
		rule: "'module' can be 'component' now",
		skip: (value, level: TestingLevel) => {
			if (level != TestingLevel.Clippy) {
				return "clippy test"
			}
			if (value != "module") {
				return "origamiType is not `module`"
			}
		},
		test() {
			// if this passes the skips, it's a fail
			return false
		},
	},
]

export default rules
