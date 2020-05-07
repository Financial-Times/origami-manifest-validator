import type {Rule} from "../lib/rule"
import {FieldType} from "../lib/field"
import * as skips from "../lib/skip"

let rules: Rule[] = [
	{
		rule: "shouldn't be defined in non-components",
		skip: skips.ifComponent,
		test: value => value === undefined
	},
]

export default {
	type: FieldType.Recurse,
	rules
}
