export function deepCompare(obj1: any, obj2: any): boolean {
	// Compare the types of the two objects
	if (typeof obj1 !== typeof obj2) {
		return false;
	}

	// If the objects are primitive types or functions, compare their values
	if (typeof obj1 !== "object" || obj1 === null || obj2 === null || obj1 instanceof Date || obj2 instanceof Date) {
		return obj1 === obj2;
	}

	// If the objects are arrays, compare their lengths and then their elements
	if (Array.isArray(obj1) && Array.isArray(obj2)) {
		if (obj1.length !== obj2.length) {
			return false;
		}

		for (let i = 0; i < obj1.length; i++) {
			if (!deepCompare(obj1[i], obj2[i])) {
				return false;
			}
		}

		return true;
	}

	// If the objects are regular objects, compare their keys and then their values
	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (const key of keys1) {
		if (!obj2.hasOwnProperty(key) || !deepCompare(obj1[key], obj2[key])) {
			return false;
		}
	}

	return true;
}