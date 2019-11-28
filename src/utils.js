import jwt from "jsonwebtoken";
import Dog from "./models/Dog";

export const createTokens = dog => {
  const accessToken = jwt.sign({ id: dog.id }, process.env.ACCESS_TOKEN_PRIVATE, { expiresIn: "15min" });
  const refreshToken = jwt.sign(
    { id: dog.id, count: dog.get("refreshTokenCount") },
    process.env.REFRESH_TOKEN_PRIVATE,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const getUserFromToken = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const refreshToken = req.cookies["refresh-token"];

  if (!accessToken && !refreshToken) return;

  try {
    const data = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE);
    req.userId = data.id;
    return;
  } catch (error) {}

  if (!refreshToken) return;

  try {
    const { id, count } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE);

    const dog = await Dog.findById(id).exec();
    if (!dog || count !== dog.get("refreshTokenCount")) return;

    const newTokens = createTokens(dog);
    res.cookie("access-token", newTokens.accessToken, { expires: new Date(Date.now() + 15 * 60 * 1000) });
    res.cookie("refresh-token", newTokens.refreshToken, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    req.userId = dog.id;
    return;
  } catch (error) {
    return;
  }
};
