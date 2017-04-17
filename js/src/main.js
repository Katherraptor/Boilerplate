$(document).ready(function() {
	function swap(a,b) {
		a = a + b;
		b = a - b;
		a = a - b;
		console.log(a, b);
	}
	swap(10,15);


});

const add = (x, y) => x + y;