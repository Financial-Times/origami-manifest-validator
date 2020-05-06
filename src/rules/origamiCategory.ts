import type {Rule} from "../lib/rule"
import * as skips from "../lib/skips"

let categories = [
	"components",
	"primitives",
	"utilities",
	"layouts",
]

let rules: Rule[] = [
	{
		rule: `components must have a category from: \n\t${categories.join(" ")}`,
		skip: skips.unlessComponent,
		test: value => categories.includes(value),
	},
	{
		rule: `must be absent if the origamiType is not module or component`,
		skip: skips.ifComponent,
		test: value => value === undefined,
	},
]

export default rules
