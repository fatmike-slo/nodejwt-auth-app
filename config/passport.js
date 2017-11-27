const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../db/models/db-users");
const dbConfig = require("./database");

module.exports = (passport)=> {
  let options = {
    secretOrKey:dbConfig.tokenSecret,
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken("jwt")
  };
  // studiraj od tle dalje
  passport.use(new JwtStrategy(options, (jwt_payload, done)=> {
   
    User.getUserById(jwt_payload._id, (err,data)=> {
      if(err) {
        return done(err,false);
      }
      if(data) {
   
        return done(null, data);
      }
      else {
        return done(null, false);
      }
    })
   }));

}