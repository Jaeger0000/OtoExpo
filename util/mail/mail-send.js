const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'otoexpo.destek@gmail.com', // Replace with your email
      pass: 'ylclymaqntfimrce' // Replace with your email password
    }
  });
  

exports.sendMailForget = (email,token)=> {
    const mailOptions = {
        from: 'otoexpo.destek@gmail.com', // Sender address
        to: email, // List of recipients
        subject: 'Reset Your Password', // Subject line
        text: 'Reset Your Password', // Plain text body
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            h1, p {
              margin: 0;
            }
            h3 {
              margin: 0 0 10px 0;
            }
            .btn {
              display: inline-block;
              padding: 10px 20px;
              background-color: black;
              color: white;
              text-decoration: none;
              border-radius: 3px;
            }
            .btn:hover {
              background-color: #555;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Reset Your Password</h1>
            <p>You recently requested to reset your password. To reset your password, click the button below:</p>
             <br>
            <p><a class="btn" href="https://www.otoexpo.shop/reset-password/${token}">Reset Password</a></p>
            <br>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Thank you,</p><h3>OtoExpo</h3>
          </div>
        </body>
        </html>
        ` // HTML body
      };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(`Error: ${error}`);
        }
        console.log(`Message Sent: ${info.response}`);
      });
}  
exports.sendMailVerification = (email,token)=> {
  const mailOptions = {
      from: 'otoexpo.destek@gmail.com', // Sender address
      to: email, // List of recipients
      subject: 'Verification Mail', // Subject line
      text: 'Verification Mail', // Plain text body
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
          h1, p {
            margin: 0;
          }
          h3 {
            margin: 0;
          }
          .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: black;
            color: #fff;
            text-decoration: none;
            border-radius: 3px;
          }
          .btn:hover {
            background-color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Email Verification</h1>
          <p>Thank you for signing up! To complete your registration, please click the button below to verify your email address:</p>
          <br>
          <p><a class="btn" href="https://www.otoexpo.shop/verify/${token}">Verify Email Address</a></p>
          <br>
          <p>If you did not sign up for an account, you can safely ignore this email.</p>
          <h3>OtoExpo</h3>
        </div>
      </body>
      </html>
      ` // HTML body
    };
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(`Error: ${error}`);
      }
      console.log(`Message Sent: ${info.response}`);
    });
}  