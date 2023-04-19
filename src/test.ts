import { build } from ".";

const assert = (condition: boolean, message: string) => {
	if (!condition) {
		throw `❌ Assertion failed: ${message}`;
	}
};

class Test {
	name: string;
	age: number;
}

const test = build(Test).age(10).$build();

assert(test.age === 10, "age should be 10");
assert(test.name === undefined, "name should be undefined");

interface Test2 {
	name: string;
	age: number;
}

const test2 = build<Test2>()
	.age(10)
	.$set({
		age: 20,
		name: "test",
	})
	.$build();

assert(test2.age === 20, "age should be 20");
assert(test2.name === "test", "name should be 'test'");

class Test3 {
	name: string;
	age: number;
	nested: {
		enabled: boolean;
	};
}

const test3 = build(Test3)
	.age(10)
	.nested((builder) => builder.enabled(true))
	.$build();

assert(test3.age === 10, "age should be 10");
assert(test3.name === undefined, "name should be undefined");
assert(test3.nested.enabled === true, "nested.enabled should be true");

class Test4 {
	name: string;
	nested: {
		enabled: boolean;
		again: {
			my: {
				god: number;
			};
		};
	};
}

const test4 = build(Test4)
	.nested((builder) =>
		builder.enabled(true).again((builder) =>
			builder.my({
				god: 2,
			}),
		),
	)
	.$build();

assert(test4.nested.enabled === true, "nested.enabled should be true");
assert(test4.nested.again.my.god === 2, "nested.again.my.god should be 2");

console.log("✅ All tests passed!");
