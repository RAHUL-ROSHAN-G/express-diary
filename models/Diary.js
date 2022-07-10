const mongoose = require('mongoose');

//Creatting schema. Structing our data in DB stored inside the collection of the db
const diarySchema = new mongoose.Schema({
	title:{
		type:String,
		required:true
	},
	description:{
		type:String,
		required:true
	},
	date:{
		type:Date,
		required:true
	}
})

//exporting model structure or schema in app.js
module.exports = mongoose.model('Diary', diarySchema);
