import bcrypt from "bcrypt";
import Dog from "../../models/Dog";

export const DogQueries = {
  dogs: () => Dog.find()
};

export const DogMutations = {
  registerDog: async (_, { email, password }) => {
    const hashedPass = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUND, 10)
    );

    const dog = new Dog({ email, password: hashedPass });

    await dog.save();
    return dog.id;
  }
};
