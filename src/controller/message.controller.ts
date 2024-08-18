import { Response } from "express";
import ConversationModel from "../models/ConversationModel";
import MessageModel from "../models/MessageModel";
import { ExtendedAuthRequest } from "../types/globalTypes";

class MessageController {
  public static async sendMessage(
    req: ExtendedAuthRequest,
    res: Response
  ): Promise<Response> {
    const { id: receiverId } = req.params;
    const { message } = req.body;
    const senderId = req.user?._id;

    if (!receiverId || !message) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    let conversation = await ConversationModel.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await ConversationModel.create({
        members: [senderId, receiverId],
      });
    }

    const newMessage = new MessageModel({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([newMessage.save(), conversation.save()]);

    return res.status(200).json({
      status: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  }

  public static async getMessages(
    req: ExtendedAuthRequest,
    res: Response
  ): Promise<Response> {
    const { id: chatUserId } = req.params;
    const senderId = req.user?._id;

    if (!chatUserId) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    let conversation = await ConversationModel.findOne({
      members: { $all: [senderId, chatUserId] },
    }).populate("messages");

    return res.status(200).json({ status: true, data: conversation?.messages });
  }
}

export default MessageController;
