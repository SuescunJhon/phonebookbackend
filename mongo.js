const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://suescunjhon:${password}@cluster0.88zwne8.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = new mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((note) => console.log(`${note.name} ${note.number}`));
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  const person = new Person({ name: process.argv[3], number: process.argv[4] });
  person.save().then((res) => {
    console.log(`added ${res.name} number ${res.number} to phonebook`);
    mongoose.connection.close();
  });
}
