const shortId = require('shortid')
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var shortUrlSchema = Schema({
    full: {
        type: String,
        required: true
      },
      short: {
        type: String,
        required: true,
        default: shortId.generate
      },
      clicks: {
        type: Number,
        required: true,
        default: 0
      }
   
});
var shortUrlSchemaData = mongoose.model('ShortUrl', shortUrlSchema);
module.exports = {
    shortUrlSchemaData
}