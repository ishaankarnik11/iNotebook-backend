const Router = require("express").Router();
const Notes = require("../models/Notes.model");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");



//Testing route : to create test notes : Not to be considered for final deployment. 
// Router.route("/").get((req,res)=>{

//     let {title, description, tag, user} = req.body;

//     const newNote = new Notes({
//         title,
//         description,
//         tag,
//         "date": Date.now(),
//         user
//     });

//     newNote.save()
//     .then(response=>res.json(response))
//     .catch(err=>res.json(err));

//     // res.json({"message": "hello from notes file"});
// })


//Route 1: fetch all the notes from DB : Login required
Router.route("/fetchallnotes").get(fetchuser, (req, res) => {
    try {
        console.log(req.user);
        Notes.find({ user: req.user.id })
            .then(data => {
                console.log(`Inside mongoose find data is : ${data}`)
                res.json(data)
            })
            .catch(err => { res.status(400).json({ "errors": err }) })

    }
    catch (err) {
        console.log(err);

    }
});


//Route 2: add a new note : Login is required
Router.route("/addnote").post(fetchuser, [
    body('title', 'Enter a valid title, minimum length of 3 characters').isLength({ min: 3 }),
    body('description', 'Enter a valid description, minimum length of 5 characters').isLength({ min: 5 }),
    body('user', 'can not create note without a user reference').exists()
],
    (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.json({ "errors": errors.array() })
            }
            else {
                let { title, description, tag, user } = req.body;
                const newNote = new Notes({
                    title,
                    description,
                    tag,
                    user
                });

                newNote.save()
                    .then(response => res.json(response))
                    .catch(err => res.status(400).json(err));

            }

        }
        catch (err) {
            console.log(err);

        }
    });

//Route 3: update existing note : login required
Router.route("/updatenote/:id").put(fetchuser, (req, res) => {
    try {
            let id = req.params.id;
            let { title, description, tag, } = req.body;
            Notes.findById(id)
                .then(note => {
                    console.log(`note user id ${note.user.toString()} and session user id ${req.user.id}`);
                    if (note.user.toString() === req.user.id) {
                        Notes.findOneAndUpdate({ _id: id }, { title, description, tag }, { new: true })
                            .then(data => res.json(data))
                            .catch(err => res.status(400).json(err));
                    }
                    else{
                        res.json({"message":"not your note to update"});
                    }
                })
                .catch(err => res.status(400).json(err));
        
    }
    catch (err) {
        console.log(err);
    }
});


//Route 4: delete the note : login is required
Router.route("/deletenote/:id").delete(fetchuser,
    (req, res)=>{
        try{
            
            
                let {id} = req.params;
                Notes.findById(id)
                .then(note=>{
                    if(note.user.toString() === req.user.id){
                        Notes.deleteOne({_id:id})
                        .then(()=>res.json({"message": "note deleted succesfully"}))
                        .catch(err=>res.status(400).json({ "errors": err }))

                    }
                })
                .catch(err=>res.status(400).json({ "errors": "please send valid note id" }))

            

        }
        catch(err){
            console.log(err);
        }
    }
);

module.exports = Router;