export function absolute(value) {
	return Math.abs(value);
}

export function roundUp(value) {
	return Math.round(value);
}

export function flatternArray(oldArray) {
	let clonedArray = [...oldArray];
	clonedArray.pop();
	return Array.prototype.concat.apply([], clonedArray);
}

export function findtotal(group, key) {
	return group.reduce((acc, val) => {
		if (val.hasOwnProperty(key)) {
			return acc + roundUp(val[key]);
		} else {
			return acc;
		}
	}, 0);
}
