import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getUsersService, updateProfileService } from "../services/user.service";

export const getUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const users = await getUsersService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Users retrieved successfully",
      users,
    });
  }
);

export const updateProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const body = req.body;

    const user = await updateProfileService(userId, body);

    return res.status(HTTPSTATUS.OK).json({
      message: "Profile updated successfully",
      user,
    });
  }
);
