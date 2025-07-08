import * as Yup from "yup";

export const NAME_VALIDATION_SCHEMA = Yup.string()
	.required("Name is a required field.")
	.test("check for first and last name", function (value) {
		if (!value?.length) return this.createError({ path: "name", message: "Name is required" });
		const names = value.split(" ").filter((e) => e.length);
		if (names.length < 2) {
			return this.createError({
				path: "name",
				message: "First & last name required",
			});
		}

		return true;
	});
