import cloudinary from "../config/cloudinary.config";
import UserModel from "../models/user.model";

export const findByIdUserService = async (userId: string) => {
  return await UserModel.findById(userId);
};

export const updateProfileService = async (
  userId: string,
  body: { name?: string; avatar?: string | null }
) => {
  let avatarUrl = body.avatar;

  if (body.avatar && body.avatar.startsWith("data:image/")) {
    const uploadRes = await cloudinary.uploader.upload(body.avatar);
    avatarUrl = uploadRes.secure_url;
  }

  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        name: body.name,
        avatar: avatarUrl,
      },
    },
    { new: true }
  ).select("-password");

  return user;
};

export const getUsersService = async (userId: string) => {
  const users = await UserModel.find({ _id: { $ne: userId } }).select(
    "-password"
  );

  return users;
};
