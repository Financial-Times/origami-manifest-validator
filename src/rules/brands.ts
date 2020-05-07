import type {Rule} from "../lib/rule"
import {FieldType} from "../lib/field"
import * as skips from "../lib/skip"

let brands = [
	"master",
	"internal",
	"whitelabel"
]

let rules: Rule[] = [
	{
		rule: `must be an array if component supports brands`,
		skip: skips.unlessComponent,
		test: value => {
			return Array.isArray(value) || value == null
		}
	},
	{
		skip: value => {
			return Array.isArray(value) ? false : "not an array"
		},
		rule: `must not have any values other than: ${brands.join(" ")}`,
		test: value => {
			return value.reduce((valid: boolean, item: string) => {
				return valid && brands.includes(item)
			}, true)
		}
	}
]

export default {
	type: FieldType.Direct,
	rules
}
