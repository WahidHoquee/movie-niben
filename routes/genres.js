const express = require('express');
const { Genre, validate } = require('../models/genre');

const router = express.Router();

router.get('/', async (req, res) => {
  try{
    const genres = await Genre.find().sort('name')
    res.send(genres);
  }
  catch(ex){
    // But there a time could come when we may change the error status,Thats when we have to change it everywhere
    // Thats why we need a central point where we will be managing all our errors
    // Express has a middleware for that, Which we are implementing in the root of our application
    res.status(500).send("Internal Server Error")
  }
});

router.post('/', async(req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });

  try {
    genre = await genre.save() ;
  } catch (error) {
    console.log(error)
  }

  res.send(genre);
});

router.put('/:id', async(req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const updatedObj = {
    $set: {
      name: req.body.name
    }
  }

  const genre = await Genre.findByIdAndUpdate(req.params.id, updatedObj, { new: true })
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.delete('/:id', async(req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id)
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.get('/:id', async(req, res) => {
  const genre = await Genre.findById(req.params.id)
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

module.exports = router;