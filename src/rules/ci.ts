export default [
	{
		skip: value => value === undefined ? "not present" : false,
		rule: "is deprecated",
		test: () => false,
	},
]
