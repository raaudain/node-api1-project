// implement your API here
const express = require("express");
const db = require("./data/db.js");

const server = express();
server.use(express.json());

server.get("/", (req, res) => {
    console.log(db);
    res.send({api: "API is up and running..."});
});

server.get("/users", (req, res) => {
    db
        .find()
        .then(item => {
            res.status(200).json(item);
        })
        .catch(err => {
            console.log("Error on GET '/users'", err);
            res.status(500).json({errorMessage: "Error retrieving item from server"});
        });
});

server.get("/users/:id", (req, res) => {
    const itemID = req.params.id;
    console.log(itemID)
    db
        .findById(itemID)
        .then(item => {
            if(item){
                res.status(200).json(item);
            }
            else{
                res.status(404).json({message: "The user with the specified ID does not exist."})
            }
        })
        .catch(err => {
            console.log("Error on GET '/items/:id'", err);
            res.status(500).json({errorMessage: "Error retrieving id from server"});
        });
});

server.post("/users", (req, res) => {
    const itemData = req.body;

    if(!itemData.name || !itemData.bio){
        res.status(400).json({errorMessage: "Please provide name and bio for the user."});
    }
    else{
        db
            .insert(itemData)
            .then(item => res.status(201).json(item))
            .catch(err => {
                console.log("Error on POST '/items'", err);
                res.status(500).json({errorMessage: "There was an error while saving the user to the database."});
            });
    }
});

server.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    console.log(req)
    db
        .remove(id)
        .then(item => {
            if(item){
                res.status(200).json({message: "User removed", item});
            }
            else{
                res.status(404).json({message: "The user with the specified ID does not exist."});
            }
        })
        .catch(err => {
            console.log("Error on DELETE '/users/:id'", err);
            res.status(500).json({error: "The user could not be removed"})
        });
});

server.put("/users/:id", (req, res) => {
    const user = req.body;
    const id = req.params.id;
    
    db
        .update(id, user)
        .then(item => {
            res.status(200).json({message: "User updated", item})
        })
        .catch(err => {
            console.log("The user with the specified ID does not exist.", err)
            res.status(404).json({message: "The user with the specified ID does not exist."})
        })
});

const port = 5000;
server.listen(port, () => console.log(`*** API running on port ${port} ***`));