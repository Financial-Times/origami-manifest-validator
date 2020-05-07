import {FieldType} from "../lib/field"

export default {
	type: FieldType.Direct,
	rules: [
		{
			skip: (value: any) => value === undefined ? "not present" : false,
			rule: "is deprecated",
			test: () => false,
		},
	]
}
