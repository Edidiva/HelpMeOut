const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
      },
  filePath:{type:String,
            required: true
      } ,
   filename:{
         type:String,
         required:true

   } 
},
{
    timestamps: true
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
