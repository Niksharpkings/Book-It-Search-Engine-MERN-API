const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/book-it",
    {
    // useNewUrlParser: true,
    //   useUnifiedTopology: true,
    })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

mongoose.set("debug", true);

module.exports = mongoose.connection;
