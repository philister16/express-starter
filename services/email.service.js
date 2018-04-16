/**
 * Email Service
 */

const mailgun = require('mailgun-js')({apiKey: process.env.MG_API_KEY, domain: process.env.MG_DOMAIN});
const HtmlEmail = require('html-email');

exports.send = (title, lang, data) => {
  const email = new HtmlEmail(title, lang);

  mailgun.messages().send({
    from: email.from(),
    to: data.user.email,
    subject: email.subject(),
    html: email.body({
      link: data.link
    })
  });
}