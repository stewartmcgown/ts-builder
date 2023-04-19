/**
 * The builder pattern for generic typescript classes and interfaces.
 */
class Builder<T> {}
type ClassType<T> = new (...args: any[]) => T;

type BuilderFn<T, P extends keyof T> = (
	builder: BuilderType<T[P]>,
) => BuilderType<T[P]> | T[P];

type BuilderType<T> = {
	[P in
		keyof T as `${P extends string
			? P extends "prototype"
				? never
				: P
			: never}`]: T[P] extends object
		? (a: BuilderFn<T, P> | T[P]) => BuilderType<T>
		: (value: T[P]) => BuilderType<T>;
} & {
	$set<K extends keyof T>(prop: K, value: T[K]): BuilderType<T>;
	$set(props: Partial<T>): BuilderType<T>;
	$build(): T;
};

/**
 * Build a new object using the builder pattern.
 *
 * @note does not support function properties
 */
export const build = <T>(type?: ClassType<T>) => {
	const obj: T = type ? new type() : ({} as T);
	const proxy = new Proxy(obj as any, {
		get: (target, prop) => {
			if (prop === "$builder") {
				return true;
			}

			if (prop === "$build") {
				return () => target;
			}

			if (prop === "$set") {
				return (key: keyof T, value: T[keyof T]) => {
					if (typeof key === "string") {
						target[key] = value;
					} else {
						Object.assign(target, key);
					}
					return proxy;
				};
			}

			return (value: any) => {
				if (typeof value === "function") {
					const nest = value(build(target[prop]));
					target[prop] = nest.$builder ? nest.$build() : value(proxy);
				} else {
					target[prop] = value;
				}
				return proxy;
			};
		},
	});

	return proxy as BuilderType<T>;
};
