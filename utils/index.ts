export * from "./parser";
export * from "./state";

export function objectModifier(object: any, fieldName: string, value: any) {
	if (object.hasOwnProperty(fieldName)) {
		// Update the existing field
		object[fieldName] = value;
	} else {
		// Create a new field
		object[fieldName] = value;
	}

	return object;
}
