const mongoose = require("mongoose");
const config = require("./../../config/database");

const bcrypt = require("bcryptjs");

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useMongoClient:true});

const connection = mongoose.connection;
connection.on("open", ()=> {
  console.log("mongo connected");
  console.log("----------------------------------------------------------");
});
connection.on("error", (err)=> {
  throw console.log("Mongo failed to connect: ", err);;
})


const UserSchema = mongoose.Schema({
  username:{type:String, required:true},
  email:{type:String, required:true},
  password:{type:String, required:true}
});

const User = mongoose.model("users", UserSchema);

// create user and hash password with bcrypt
module.exports.createUser = (data, callback)=> {
  console.log("data ", data);
  bcrypt.genSalt(10, (err,salt)=> {
    console.log("Salt generated: ", salt);
    bcrypt.hash(data.password, salt, (err, hash)=> {
      console.log("obj.password: ", data.password);
      console.log("Hash generated: ", hash);
      if(err) {
        throw err
      }
      data.password = hash;
      let newUser = new User({
        username:data.username,
        email:data.email,
        password:data.password
      });
      newUser.save(callback);
    });
  });
}

// get user by Id
module.exports.getUserById = (id, callback)=> {
  User.findById(id, callback);
}
// get user by Username
module.exports.getUserByUsername = (username, callback)=> {
  User.findOne({username:username}, callback);
}
module.exports.comparePassword = (candidatePassword, hash, callback)=> {
  bcrypt.compare(candidatePassword, hash, (err, isMatch)=> {
    if(err) {
      throw err
    }
    // if hash and password match, return callback true
    callback(null, isMatch)
  });
}


// DEV TESTING
// get all users
module.exports.viewAllUser = (callback)=> {
  User.find({}, (callback));
}
// delete all users
module.exports.deleteAllUsers = (callback)=> {
  User.remove({}, (callback));
}
