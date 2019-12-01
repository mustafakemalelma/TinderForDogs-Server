import { AuthenticationError } from "apollo-server-core";
import bcrypt from "bcrypt";
import { createWriteStream } from "fs";
import moment from "moment";
import path from "path";
import { isEmail, isLength, isEmpty } from "validator";

import Dog from "../../models/Dog";
import { createTokens } from "../../utils";
import Match from "../../models/Match";

//This is the graphql queries for Dog Type
export const DogQueries = {
  //this is the endpoint for login
  //checks if email exist
  //checks if password correct
  //if all correct it sets the cookies for access token, refresh token
  //and sends the dog object
  loginDog: async (_, { email, password }, { res }) => {
    if (!isEmail(email) || !isLength(password, { min: 8, max: 16 })) throw new Error("You have invalid fields!");

    const foundDog = await Dog.findOne({ email }).exec();
    if (!foundDog) throw new Error("There is no such dog!");

    //Comparing the password with the hashed one in the database
    const isPasswordCorrect = await bcrypt.compare(password, foundDog.get("password"));
    if (!isPasswordCorrect) throw new Error("Wrong password!");

    const { accessToken, refreshToken } = createTokens(foundDog);
    res.cookie("access-token", accessToken, { expires: new Date(Date.now() + 5 * 1000) });
    res.cookie("refresh-token", refreshToken, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

    return foundDog;
  },

  //An endpoint for returning the profile of logged in dog
  me: async (_, __, { req }) => {
    if (!req.userId) throw new AuthenticationError("You must be logged in!");

    const dog = await Dog.findById(req.userId).exec();
    if (!dog) throw new Error("No such user id");

    return dog;
  },

  //An endpoint for retrieving all dogs that registered
  dogs: async (_, __, { req }) => {
    const dogs = await Dog.find().exec();

    const imageUrl = req.protocol + "://" + req.get("host") + "/images/";
    dogs.forEach(el => el.set("profilePic", imageUrl + el.get("profilePic")));

    return dogs;
  },

  //An endpoint for retrieving the candidate dogs for the logged in dog.
  //It filters previously liked and disliked dogs
  candidateDogs: async (_, __, { req }) => {
    if (!req.userId) throw new AuthenticationError("You must be logged in!");

    const me = await Dog.findById(req.userId).exec();

    const dogs = await Dog.find().exec();
    return dogs.filter(
      el => el.id !== me.id && !me.get("likes").includes(el.id) && !me.get("dislikes").includes(el.id)
    );
  }
};

//This is the graphql mutations for Dog Type
export const DogMutations = {
  //An endpoint for registering a new dog to database
  registerDog: async (_, { email, password, name, profilePic, selfSummary, breed, age, size, weight, address }) => {
    //VALIDATION
    if (isEmpty(name) || isEmpty(breed) || isEmpty(age) || isEmpty(size) || isEmpty(address))
      throw new Error("There are empty fields!");

    if (!isEmail(email) || !isLength(password, { min: 8, max: 16 }) || weight === 0)
      throw new Error("You have invalid fields!");

    if (!profilePic) throw new Error("You must provide 1 photo");

    //IS EXIST
    const isExist = await Dog.findOne({ email }).exec();
    if (isExist) throw new Error("This dog is already exist");

    //Getting the profile picture
    const { createReadStream, filename } = await profilePic;
    const profilePicPath = name + "_" + filename;
    await new Promise(res =>
      createReadStream()
        .pipe(createWriteStream(path.join(__dirname, "../../../static/images", profilePicPath)))
        .on("close", res)
    );

    //Hashing the password before writing to database for security
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND, 10));

    const dog = new Dog({
      email,
      password: hashedPassword,
      name,
      profilePic: profilePicPath,
      selfSummary,
      breed,
      age,
      size,
      weight,
      address,
      createdDate: moment().format()
    });

    await dog.save();
    return dog.id;
  },

  //An endpoint for invalidating refresh token so that the user not getting a new access token when it expires.
  //Used for logout.
  invalidateTokens: async (_, __, { req }) => {
    if (!req.userId) throw new AuthenticationError("You must be logged in!");

    const user = await Dog.findById(req.userId).exec();
    if (!user) return false;

    user.refreshTokenCount += 1;
    await user.save();

    return true;
  },

  //An endpoint for liking a dog.
  //If other dog also likes the dog that made the request, it will create match object.
  like: async (_, { likedId }, { req }) => {
    if (!req.userId) throw new AuthenticationError("You must be logged in!");

    const likedDog = await Dog.findById(likedId).exec();
    if (!likedDog) return { successful: false };

    const me = await Dog.findById(req.userId).exec();
    me.likes.push(likedId);
    await me.save();

    const isAMatch = likedDog.likes.includes(req.userId);
    if (isAMatch) {
      const matchObject = new Match({ dog1: req.userId, dog2: likedDog, matchDate: moment().toDate() });
      await matchObject.save();

      likedDog.matches.push(matchObject.id);
      await likedDog.save();
      me.matches.push(matchObject.id);
      await me.save();
    }

    return { successful: true, isAMatch };
  },

  //An endpoint for disliking a dog.
  dislike: async (_, { dislikedId }, { req }) => {
    if (!req.userId) throw new AuthenticationError("You must be logged in!");

    const dislikedDog = await Dog.findById(dislikedId).exec();
    if (!dislikedDog) return false;

    const me = await Dog.findById(req.userId).exec();
    me.dislikes.push(dislikedId);
    await me.save();
    return true;
  }
};
