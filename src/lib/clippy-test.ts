import {TestingLevel} from "../lib/testing-level"
export default (_value: any, level: TestingLevel) =>
	level == TestingLevel.Clippy
	? false
	: "(clippy test)"
