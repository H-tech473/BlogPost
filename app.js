//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://"+(process.env.name || `harman`)+":"+(process.env.password || `uzOCWIXoycQstfM2`)+"@cluster0.upwjcyv.mongodb.net/blogPosts?retryWrites=true&w=majority", {useNewUrlParser: true});
const post = new mongoose.Schema({title: String, content: String});
const Post_mod = mongoose.model("posts", post);

const createPost = mongoose.model("createPosts", post)

// const Home = new Post_mod({
//   title: "Home",
//   content: homeStartingContent
// })
// const About = new Post_mod({
//   title: "About",
//   content: aboutContent
// })
// const Contact = new Post_mod({
//   title: "Contact",
//   content: contactContent
// })

// Post_mod.insertMany([Home, About, Contact]).then(()=>{console.log("done")})

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req,res)=>{
  Post_mod.find({title: "Home"}).then(Home =>{
    createPost.find({}).then(posts =>{
      res.render("home", {content: Home[0].content, posts: posts});
    })
  })
})

app.get("/about", (req, res)=>{
  Post_mod.find({title: "About"}).then(About =>{
      res.render("about", {content: About[0].content});
  })
})

app.get("/contact", (req,res)=>{
  Post_mod.find({title: "Contact"}).then(Contact =>{
      res.render("contact", {content: Contact[0].content});
  })
})

app.get("/compose", (req, res)=>{
  res.render("compose")
})

app.post("/compose", (req,res)=>{
  const post = new createPost({
    title: req.body.article,
    content: req.body.content
  });
  post.save().then(()=>{
    res.redirect("/");
  })

})

app.get("/posts/:topics", (req,res)=>{
  createPost.find({}).then(posts =>{
    posts.forEach(function(post){
      if(_.lowerCase(post.title) === _.lowerCase(req.params.topics)){
        res.render("post", {title: post.title, content: post.content})
      }
    })
  })
})

app.get("*", (req,res)=>{
  res.render("post", {title: "Error 404", content:"Wrong url entered"})
})





const server = app.listen(port, function() {
  console.log("Server started on port "+port);
});

server.keepAliveTimeout= 120*1000;
server.headersTimeout = 120*1000;
