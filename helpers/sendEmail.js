const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SG_API_KEY } = process.env;

sgMail.setApiKey(SG_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "a310thunderbolt@gmail.com" };
  await sgMail.send(email);
  return true;
};

module.exports = sendEmail;
