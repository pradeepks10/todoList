const express = require("express");
const bodyParser = require("body-parser");
// const { application } = require("express");
// const Date = require(__dirname+"/date.js");

// for upper/lower case handle
const _ = require("lodash");

const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

// const itemLists = ["Buy Food","Eat Food","Read Books"];
// const workItems =[];
mongoose.set('strictQuery',false);
mongoose.connect(process.env.CONNECTION_URL,{useNewUrlParser:true});
// mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});
const itemSchema = {
        name:String
};

const Item = mongoose.model("Item",itemSchema);

const ReadBooks = new Item({
    name:"ReadBooks"
});
const Play = new Item({
    name:"Play"
});
const WatchMovie = new Item({
    name:"WatchMovie"
});

const defaultItems = [ReadBooks,Play,WatchMovie];


//schema for diffrent items like for work, home

const listSchema = {
    name:String,
    items:[itemSchema]
}

const List =  mongoose.model("List",listSchema);




app.get("/",function(req,res){
   
// const day = Date.getDate();
Item.find(function(err,foundItems){
    if(foundItems.length === 0){

        Item.insertMany(defaultItems,function(err){
            if(err)
                console.log(err);
            else
                console.log("Sussessfully added all items");
        });

        res.redirect("/");
    }
    else{
        res.render("list",{ListTitle:"Today",newListItems:foundItems});
    }
});


});

// // this is static creation of new routes
// app.get("/work",function(req,res){

//     res.render("list",{ListTitle:"Work List",newListItems:workItems});
// });

// app.get("/about",function(req,res){
//     res.render("about");
// });


// // Dynamic creation of routes using ejs

app.get("/:customeListName",function(req,res){
    const customeListName = _.capitalize(req.params.customeListName);

    List.findOne({name:customeListName},function(err,foundList){
        if(!err){
            if(!foundList){
                // list does not exit ,so create
                const list = new List({
                    name:customeListName,
                    items :defaultItems
                });
                list.save();
                res.redirect("/"+ customeListName);
            }
            else{
                // list exit, show exiting list
                res.render("list",{ListTitle:foundList.name,newListItems:foundList.items})
            }
        }
    });
    
});


app.post("/",function(req,res){

// This part is for without databse
    // newItem = req.body.newItem;

    // //since form always give post to home page("/"), in order to post to work page we have to write some logic
    // if(req.body.list === "Work List"){
    //     workItems.push(newItem);
    //     res.redirect("/work");
    // }
    // else{
    // items.push(newItem);
    //  res.redirect("/");
    // }

// this is for database

    const itemName = req.body.newItem;
// this is for, in which  new item is created
    const listName = req.body.list;

    const newAddedItem = new Item({
        name:itemName
    });

//if new item created in "Today" list then simply save and redirect to "/"
//else search the list in database
    if(listName === "Today"){
        newAddedItem.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(newAddedItem);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
   
});

app.post("/delete",function(req,res){
    checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if(listName === "Today"){
        Item.findByIdAndDelete(checkedItemId,function(err){
            if(!err)
                console.log("Checked Item Deleted");
        });
        res.redirect("/");
    }
    else{
        //find list then find listName item in array of found list,then delete it and save
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        });
    } 
});









 

app.listen(process.env.PORT||3000,function(){
console.log("Server started on port number 3000 ...");
});







