const express=require('express')
const router=express.Router()
const Item=require('../models/Item')

const multer=require('multer')
const path=require('path')


// multer
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
})

const upload=multer({storage})


//get

router.get('/',async(req , res)=>{
    try{
        const items=await Item.find()
        res.json(items)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})


//post

router.post('/',upload.single('image'),async(req,res)=>{
    try{
        const newItem=new Item({
            title:req.body.title,
            description:req.body.description,
            startingBid: req.body.startingBid,
            currentBid: null,  
            imageUrl: req.file?req.file.path:'',
            endTime: req.body.endTime
        })


        const savedItem=await newItem.save()
        res.status(201).json(savedItem)

    }

    catch(err){
        res.status(400).json({message:err.message})

    }
})


router.patch('/:id/bid', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    const newBid = parseFloat(req.body.bid);
    const username = req.body.username;  // <- get username from request

    if (!username) return res.status(400).json({ message: 'Username is required' });

    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (isNaN(newBid)) return res.status(400).json({ message: 'Bid must be a valid number' });

    const current = item.currentBid ?? item.startingBid;
    if (newBid <= current) {
      return res.status(400).json({ message: 'Bid must be higher than current bid' });
    }

    // Update currentBid, highestBidder, and add the bid record
    item.currentBid = newBid;
    item.highestBidder = username;
    item.bids.push({ username, amount: newBid });

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;


