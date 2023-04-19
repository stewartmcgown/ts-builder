import { ClassType } from ".";

export function getNestJSGraphQLClassType<T>(
	type: ClassType<T>,
	prop: string | symbol,
) {
	try {
		const nest = require("@nestjs/graphql/dist/schema-builder/storages/type-metadata.storage");

		const metadata = nest.TypeMetadataStorage.metadataByTargetCollection
			.get(type)
			.fields.getByName(prop);

		return metadata.typeFn();
	} catch {}
}
