import type {Rule} from "../lib/rule"

let brands = [
	"master",
	"internal",
	"whitelabel"
]

let rules: Rule[] = [
	{
		rule: `must be an array if component supports brands`,
		test: value => {
			return Array.isArray(value) || value == null
		}
	},
	{
		skip: value => {
			return Array.isArray(value) ? false : "not an array"
		},
		rule: `must not have any values other than:\n\t${brands.join("\n\t")}`,
		test: value => {
			return value.reduce((valid, item) => {
				return valid && brands.includes(item)
			}, true)
		}
	},
	{
		skip: () => "CHECK IF O-BRAND IS USED IN DEMOS ETC",
		test: () => false,
		rule: "must include all used brands"
	},
	{
		skip: () => "CHECK IF O-BRAND IS USED IN SASS???",
		test: () => false,
		rule: "must include all used brands"
	}
]

export default rules
