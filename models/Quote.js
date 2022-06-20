const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuoteSchema = new Schema(
  {
    desc: {
      type: String,
      required: true,
      min: 3,
    },
  },
  { timestamps: true }
);

const Quote = mongoose.model("Quote", QuoteSchema);

exports.Quote = Quote;
