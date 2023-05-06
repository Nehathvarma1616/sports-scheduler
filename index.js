const app = require("./app");

const server = app.listen(3000,  () => {
	console.log('listening to port 3000')
});