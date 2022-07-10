const express = require('express'); // from node modules exported
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();

//for dynamicalky allocation we use process 
const port = process.env.PORT || 3000;

//set templating engine as ejs
app.set('view engine', 'ejs');

//serving static files => middleware for static files.
app.use(express.static('public'))

//middleware for the bodyparser help data to retrive from the form.
app.use(bodyparser.urlencoded({ extended: false}))
app.use(bodyparser.json())

//middleware for method-override
app.use(methodOverride('_method'));

//database url
const url = 'mongodb+srv://Rahul-Roshan-G:12345@cluster0.4lom8.mongodb.net/Diary?retryWrites=true&w=majority';
//added the dbname => Diary
//install mongoose


//connecting applications with database
mongoose.connect(url,{
	useNewUrlParser:true,
	useUnifiedTopology:true
}).then(console.log("Mongo DB connected"))
.catch(err => console.log(err))

//import Diary Model
const Diary = require('./models/Diary');

//Routing
//route for /
app.get('/', (req, res) => {
	//res.render('Home', {value:"Rahul Roshan G"});
	res.render('Home');
})

//Route for about page
app.get('/about', (req,res) =>{
	//res.send("<h1>About page</h1>");
	res.render('About');
})

//Route for Diary Page
app.get('/diary', (req,res) => {
	//model instainte new model when adding data.
	Diary.find()
	.then(data => {
		//console.log(data)
		//display in browser
		res.render('Diary',{data: data});
	})
	.catch(err=>console.log(err))
})

//Route for adding Records
app.get('/add', (req,res) => {
	res.render('Add');
})

//Route for saving Diary
app.post('/add-to-diary', (req,res) => {
	//for whole form fields to display
	//res.send(req.body);
	//to display only the title
	//res.send(req.body.title);

	//save data on the database
	//instaing model
	const Data = new Diary({
		title:req.body.title,
		description:req.body.description,
		date:req.body.date
	})

	//save the data return promise and callback function 
	Data.save().then( () =>{
		res.redirect('/diary');
	}).catch(err=> console.log(err));
})

//Route for displaying records
app.get('/diary/:id', (req,res) => {
	//works only if we have :id for id displaing.
	//res.send(req.params.id)
	//use th model and if match id of both req.params.id and model diary display all the text.
	Diary.findOne({
		_id:req.params.id
	}).then(data => {
		res.render('Page',{data:data});
	}).catch(err => console.log(err))	
})

//Route for edit page
app.get('/diary/edit/:id', (req,res) => {
	Diary.findOne({
		_id:req.params.id
	}).then(data =>{
		res.render('Edit',{data:data})
	}).catch(err => console.log(err));
})

//Edit data route
app.put('/diary/edit/:id', (req,res) =>{
	Diary.findOne({
		_id:req.params.id
	}).then(data =>{
		data.title = req.body.title
		data.description = req.body.description
		data.date = req.body.date

		data.save().then(() => {
			res.redirect('/diary');
		}).catch(err => console.log(err));
	}).catch(err=>console.log(err))
	//res.send(req.params.id)
})

//delete from database route
app.delete('/data/delete/:id', (req,res) =>{
	Diary.remove({
		_id:req.params.id
	}).then(()=>{
		res.redirect('/diary');
	}).catch(err=>console.log(err))
})

app.listen(port, () => console.log('server is running')); //create server

//get the html file from the server so we use the http reqest
//post method is more secure than get method value of title appear in the url bar
//mongoose helps u to connect with database and interact woth the database.