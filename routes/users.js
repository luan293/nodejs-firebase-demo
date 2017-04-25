var userController = require('../controllers/users')
//import userController from '@controllers'
console.log(userController)
module.exports = function(app) {  
    app.route('/user')
        .get((req, res) => {
			userController.getUserController(req, res)
		})
		.post((req, res) => {
			userController.regUserController(req, res)
		})

	app.route('/reg')
        .get((req, res) => {
			userController.renderRegUserController(req, res)
		})
		.post((req, res) => {
			userController.regUserController(req, res)
		})
	app.route('/login')
        .get((req, res) => {
			userController.rederLoginUserController(req, res)
		})
		.post((req, res) => {
			userController.loginUserController(req, res)
		})
	app.route('/logout')
        .get((req, res) => {
			userController.logoutUserController(req, res)
		})
	app.route('/edit')
        .get((req, res) => {
			userController.renderEditUserController(req, res)
		})
		.patch((req, res) => {
			userController.editUserController(req, res)
		})
	app.route('/delete/:id')
        .get((req, res) => {
			userController.deleteUserController(req, res)
		})
}