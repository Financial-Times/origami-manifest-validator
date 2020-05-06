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
		skip: (_value, level: TestingLevel) => {
			if (level != TestingLevel.Clippy) {
				return "(clippy test)"
			}
		},
		test: (value) => {
			if (value == "module") {
				// this clippy test should fail if the value is module
				return false
			} else {
				return true
			}
		},
	},
]

export default rules
