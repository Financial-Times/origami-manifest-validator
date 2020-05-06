import type {Rule} from "../lib/rule"
import {unlessClippy} from "../lib/skips"

let rules: Rule[] = [
	{
		rule: "must have .email string",
		test: value => typeof value.email == "string",
	},
	{
		rule: "must have .slack string",
		test: value => typeof value.slack == "string",
	},
	{
		rule: "email address must be valid",
		test: value => String(value.email).split(/.@./).length == 2,
	},
	{
		rule: "slack address must be in format organisation/channelname",
		test: value => String(value.slack).split(/.\/./).length == 2,
	},
	{
		rule: "email domain should be @ft.com",
		skip: unlessClippy,
		test: value => /@ft.com$/.test(value.email),
	},
	{
		rule: "slack organisation should be financialtimes",
		skip: unlessClippy,
		test: value => /^financialtimes\//.test(value.slack),
	},
]

export default rules
