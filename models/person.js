const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => console.log("connected to MongoDB"))
  .catch((error) => console.log("error connecting to MongoDB", error.message));

const personaSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: (v) => /(?<!\S)\b\d{2,3}-\d+\b(?!\S)/.test(v),
      message: (props) => `${props.value} is nota a valid number`,
    },
  },
});

///(?<!\S)\b\d{2,3}-\d+\b(?!\S)/g

personaSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personaSchema);
