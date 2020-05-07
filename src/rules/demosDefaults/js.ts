import type {Rule} from "../../lib/rule"
import {FieldType} from "../../lib/field"
import * as Rules from  "../../lib/rule"

let rules: Rule[] = [
	...Rules.isFileOrUndefinedComponentOnly
]

export default {
	type: FieldType.Direct,
	rules
}
