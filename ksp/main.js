// Runs script when page is loaded or reloaded
$(function () {
	console.log("Script by kakol20");
	console.log("-----");
	//console.log("");
});

const tools = (function () {
	return {
		updateBody: function () {
			this.orbitBody = document.getElementById("orbitBody").value || "kerbin";

			console.log("Orbit Body changed to: " + this.orbitBody);
		},
		orbitBody: "kerbin"
	};
})();