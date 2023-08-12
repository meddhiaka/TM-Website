const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
require("dotenv").config({});

const subConfirmation = async (userEmail, title, firstName, lastName) => {
  const config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  };
  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "salted",
    product: {
      logo: "https://scontent.ftun9-1.fna.fbcdn.net/v/t39.30808-6/308672381_441069094786546_7287956685567192158_n.jpg?_nc_cat=106&cb=99be929b-59f725be&ccb=1-7&_nc_sid=be3454&_nc_ohc=kWUp2ZjVqV4AX-4cLfY&_nc_ht=scontent.ftun9-1.fna&oh=00_AfBIlPed9FedR07YLZa4-IzqgZofcf_91d49IQBhdc-BiQ&oe=64DA92F9",
      logoHeight: "200px",
      name: "Taa Marbouta",
      link: "https://www.taamarbouta.com/",
    },
  });

  let response = {
    body: {
      greeting: "Dear",
      name: `${firstName} ${lastName}`,
      intro: [
        `Thank you for signing up to the ${title} course with the Taa Marbouta Language Centre. 
        We can confirm that we have received your interest. 
        If you have signed up for an intermediate or advanced course you can now download the placement test from the sign-in area on our website. 
        If you are a beginner there is no need for you to complete the placement test.`,
      ],
      action: {
        instructions:
          "Once you have completed this step, please proceed with payment in either US Dollars, British Pounds, Euros, or Canadian Dollars via the card payment portal on our website. If you prefer to pay in a different currency or have any questions, please reach out to us: info@taamarbouta.com.",
        button: {
          color: "#0a5290",
          text: "Subscription process",
          link: "https://www.taamarbouta.com/",
        },
      },
      outro: ["We look forward to supporting you on your language-learning journey !", "Many thanks, Taa Marbouta Team"],
      signature: 'Sincerely'
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: `Subscription confirmed for ${title} course`,
    html: mail,
  };

  await transporter
    .sendMail(message)
    .then((info) => {
      console.log("Subscription email successfully sent ✅ --> " + info.accepted);
    })
    .catch((error) => {
      console.log("Email not sent ⛔️");
      console.log(error);
    });
};

const contactUs = async (text, firstName, lastName) => {
  const config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  };
  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "salted",
    product: {
      logo: "https://scontent.ftun9-1.fna.fbcdn.net/v/t39.30808-6/308672381_441069094786546_7287956685567192158_n.jpg?_nc_cat=106&cb=99be929b-59f725be&ccb=1-7&_nc_sid=be3454&_nc_ohc=kWUp2ZjVqV4AX-4cLfY&_nc_ht=scontent.ftun9-1.fna&oh=00_AfBIlPed9FedR07YLZa4-IzqgZofcf_91d49IQBhdc-BiQ&oe=64DA92F9",
      logoHeight: "200px",
      name: "Taa Marbouta",
      link: "https://www.taamarbouta.com/",
    },
  });

  let response = {
    body: {
      greeting: "From ",
      name: `${firstName} ${lastName}`,
      intro: `${text}`,
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: `TM Website - Contact us message from ${firstName} ${lastName}`,
    html: mail,
  };

  await transporter
    .sendMail(message)
    .then((info) => {
      console.log("Contact us mail successfully sent ✅");
    })
    .catch((error) => {
      console.log("Email not sent ⛔️");
      console.log(error);
    });
};

module.exports = { contactUs, subConfirmation };
