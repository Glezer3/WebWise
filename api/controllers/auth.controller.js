import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import { errorHandler } from "../utils/handleError.js";
import {
  sendEmail,
  generateEmailTemplateVerify,
  generateEmailTemplateReset,
} from "../utils/sendEmail.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    newEmail: undefined,
  });
  try {
    await newUser.save();

    const verify_token = await new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const verifyURL = `${req.protocol}://${req.get("host")}/verify/${
      newUser._id
    }/${verify_token.token}`;
    const message =
      `We have received an email verification request. Please use the link below to verify your email: \n\n ${verifyURL} \n\n ` +
      `Please remember that this link for email verification will be valid only for 1 hour.`;

    try {
      await sendEmail({
        email: newUser.email,
        subject: "Verify email",
        message: message,
        html: generateEmailTemplateVerify(verifyURL),
      });

      res.status(200).json("The verification email was sent");
    } catch (error) {
      verify_token.userId = undefined;
      verify_token.token = undefined;
      verify_token.save({ validateBeforeSave: false });
      return next(
        errorHandler(500, "Something went wrong. Please try again later")
      );
    }
  } catch (error) {
    next(error);
  }
};

export const verification = async (req, res, next) => {
  const { id, verify_token } = req.params;

  try {
    const validUser = await User.findOne({ _id: id });
    if (!validUser) return next(errorHandler(400, "Invalid link"));
    if (validUser.verified)
      return res.status(200).json("This email is already verified");

    const validToken = await Token.findOne({
      userId: validUser._id,
      token: verify_token,
    });
    if (!validToken) return next(errorHandler(400, "Invalid or expired token"));

    await validUser.updateOne({ _id: validUser._id, verified: true });
    await Token.findOneAndDelete({ token: verify_token });

    res.status(200).json("Email successfully verified");
  } catch (error) {
    next(error);
  }
};

export const verifyNewEmail = async (req, res, next) => {
  const { id, newEmail_token } = req.params;

  try {
    const validUser = await User.findOne({ _id: id });
    if (!validUser) return next(errorHandler(400, "Invalid link"));

    const validToken = await Token.findOne({
      userId: validUser._id,
      token: newEmail_token,
    });

    if (!validToken) return next(errorHandler(400, "Invalid or expired token"));

    if (validUser.newEmail) {
      validUser.email = validUser.newEmail;
      validUser.newEmail = undefined;
      await validUser.save();
    } else {
      console.log("No new email set");
      return next(errorHandler(400, "No new email to update"));
    }

    await validToken.deleteOne();

    res.status(200).json("New email successfully verified!");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const { resend } = req.query;
  try {
    const validUser = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });
    if (!validUser) return next(errorHandler(404, "User not found!"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

    if (!validUser.verified) {
      if (resend === "true") {
        const existingToken = await Token.findOne({ userId: validUser._id });
        if (existingToken) await Token.deleteOne({ userId: validUser._id });

        const verify_token = await new Token({
          userId: validUser._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const verifyURL = `${req.protocol}://${req.get("host")}/verify/${
          validUser._id
        }/${verify_token.token}`;
        const message =
          `We have received an email verification request. Please use the link below to verify your email: \n\n ${verifyURL} \n\n ` +
          `Please remember that this link for email verification will be valid only for 1 hour.`;

        try {
          await sendEmail({
            email: validUser.email,
            subject: "Verify email",
            message: message,
            html: generateEmailTemplateVerify(verifyURL),
          });

          return res.status(200).json("The verification email has been resent");
        } catch (error) {
          verify_token.userId = undefined;
          verify_token.token = undefined;
          verify_token.save({ validateBeforeSave: false });
          return next(
            errorHandler(500, "Something went wrong. Please try again later")
          );
        }
      }
      return next(errorHandler(400, "The verification email was sent"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true /*expires: new Date(Date.now() + 24 * 60 * 60 * 1000)*/,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, photo } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true /*expires: new Date(Date.now() + 24 * 60 * 60 * 1000)*/,
        })
        .status(200)
        .json(rest);
    } else {
      const randomPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedRandomPassword = bcryptjs.hashSync(randomPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-5),
        email: email,
        password: hashedRandomPassword,
        avatar: photo,
        verified: true,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true /*expires: new Date(Date.now() + 24 * 60 * 60 * 1000)*/,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out");
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const { resend } = req.query;

  try {
    const validUser = await User.findOne({ email: email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    if (!validUser.verified)
      return next(errorHandler(403, "Please verify your email first!"));

    const isTokenValid = validUser.passwordResetToken && validUser.passwordResetTokenExpires > Date.now();
    
    if (isTokenValid && !resend) {
      return next(errorHandler(429, "The email was already sent"));
    }

    if (resend === "true" || !isTokenValid) {
      validUser.passwordResetToken = undefined;
      validUser.passwordResetTokenExpires = undefined;
      await validUser.save();

      const secret = process.env.JWT_SECRET + validUser.password;
      const reset_token = jwt.sign(
        { email: validUser.email, id: validUser._id },
        secret,
        { expiresIn: "10m" }
      );
      const linkURL = `${req.protocol}://${req.get("host")}/reset-password/${validUser._id}/${reset_token}`;
      const message = `We have received a password reset request. Please use the link below to reset your password: ${linkURL} (valid for 10 minutes)`;

      try {
        await sendEmail({
          email: validUser.email,
          subject: "Password reset request",
          message: message,
          html: generateEmailTemplateReset(linkURL),
        });

        validUser.passwordResetToken = reset_token;
        validUser.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
        await validUser.save();

        return res.status(200).json({ success: true, message: "The reset email has been resent" });
      } catch (error) {
        validUser.passwordResetToken = undefined;
        validUser.passwordResetTokenExpires = undefined;
        await validUser.save({ validateBeforeSave: false });
        return next(errorHandler(500, "Something went wrong. Please try again later"));
      }
    }

    const secret = process.env.JWT_SECRET + validUser.password;
    const reset_token = jwt.sign(
      { email: validUser.email, id: validUser._id },
      secret,
      { expiresIn: "10m" }
    );
    const linkURL = `${req.protocol}://${req.get("host")}/reset-password/${validUser._id}/${reset_token}`;
    const message = `We have received a password reset request. Please use the link below to reset your password: ${linkURL} (valid for 10 minutes)`;

    try {
      await sendEmail({
        email: validUser.email,
        subject: "Password reset request",
        message: message,
        html: generateEmailTemplateReset(linkURL),
      });

      validUser.passwordResetToken = reset_token;
      validUser.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
      await validUser.save();

      res.status(200).json({ success: true, message: "Email was sent" });
    } catch (error) {
      validUser.passwordResetToken = undefined;
      validUser.passwordResetTokenExpires = undefined;
      await validUser.save({ validateBeforeSave: false });
      return next(errorHandler(500, "Something went wrong. Please try again later"));
    }
  } catch (error) {
    next(error);
  }
};


export const resetPassword = async (req, res, next) => {
  const { newPassword } = req.body;
  const { reset_token } = req.params;
  const validUser = await User.findOne({
    passwordResetToken: reset_token,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!validUser)
    return next(
      errorHandler(400, "Token is either invalid or has already expired")
    );

  try {
    const newHashedPassword = bcryptjs.hashSync(newPassword, 10);

    validUser.password = newHashedPassword;
    validUser.passwordResetToken = undefined;
    validUser.passwordResetTokenExpires = undefined;
    validUser.passwordChangedAt = Date.now();

    await validUser.save();
    res
      .status(200)
      .json({ success: true, message: "Password successfully reset" });
  } catch (error) {
    next(error);
  }
};
