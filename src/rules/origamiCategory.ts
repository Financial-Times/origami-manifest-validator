import type {Rule} from "../lib/rule"
import {FieldType} from "../lib/field"
import * as skips from "../lib/skip"

let categories = [
	"components",
	"primitives",
	"utilities",
	"layouts",
]

let rules: Rule[] = [
	{
		rule: `component category must be one of: ${categories.join(" ")}`,
		skip: skips.unlessComponent,
		test: value => categories.includes(value),
	},
	{
		rule: `must be absent if the origamiType is not module or component`,
		skip: skips.ifComponent,
		test: value => value === undefined,
	},
]

export default {
	type: FieldType.Direct,
	rules
}
