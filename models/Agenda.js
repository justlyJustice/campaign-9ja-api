const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AgendaSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    aspirantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aspirant",
    },
  },
  { timestamps: true }
);

const Agenda = mongoose.model("Agenda", AgendaSchema);

exports.Agenda = Agenda;
