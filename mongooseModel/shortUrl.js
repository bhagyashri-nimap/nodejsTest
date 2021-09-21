const shortId = require('shortid')
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var shortUrlSchema = Schema({
    full: {
        type: String,
        
      },
      short: {
        type: String,
       
        default: shortId.generate
      }
   
});
var shortUrlSchemaData = mongoose.model('ShortUrl', shortUrlSchema);
module.exports = {
    shortUrlSchemaData
}