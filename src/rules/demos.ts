import type {Rule} from "../lib/rule"
import {FieldType, Field} from "../lib/field"
import {ifComponent} from "../lib/skip"

let rules: Rule[] = [
	{
		rule: "shouldn't be defined in non-components",
		skip: ifComponent,
		test: value => value === undefined
	},
]

let field: Field = {
	type: FieldType.EachRecurse,
	rules
}

export default field
