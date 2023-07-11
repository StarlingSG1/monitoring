import { Router } from "express";
const fetch = require("node-fetch");
const dotenv = require("dotenv");
import bcrypt from "bcryptjs";
dotenv.config();
import prisma from "../../../helpers/prisma";
import ucwords from "../../../helpers/cleaner";
import jwt from "jsonwebtoken";
import { getUserEnterprise, getUserFinded } from "../../../helpers/userFunctions";
import { mailer } from "../../../middlewares/nodemailer";
// import mailer from "../../../helpers/mailjet";

const api = Router();
// LE LOGIN
api.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(200).json({ error: true, message: "Tout les champs doivent être rempli" });
    }
    // Validate if user exist in our database
    
  } catch (err) {
    console.log(err);
  }
});

api.post("/me", async ({ body }, res) => {
  const myBody = body

  try {
    const decoded = jwt.verify(myBody.token, process.env.TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    delete user.password;

  } catch (err) {
    res.status(200).send({ error: true, message: "Pas de token ou invalide" });
  }
});

export default api;