function sendEmail() {
  switch (process.env.NODE_ENV) {
    case "test", "development":
      console.log("Skipped emailing because this is a Dev/Test environment")  
      return;
    default:
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: 'ian@eibar.app', // Change to your recipient
        from: 'bounce@eibar.app', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      return sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent');
        })
        .catch((error) => {
          console.error(error);
        });
  }
}

module.exports = { sendEmail };