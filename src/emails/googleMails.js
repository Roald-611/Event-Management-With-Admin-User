const mailer = require('nodemailer');
var Mailgen = require('mailgen');
require('dotenv').config();

const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS
    }
})

// Configure mailgen by setting a theme and your product info
var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Event-Management',
        link: 'https://google.com'
    }
});

// Prepare email contents
const welcomeEmail = (mail, name) => {

    var email = {
        body: {
            name: `Welcome ${name}`,
            intro: `Welcome to Event-Menegment-Requests! We\'re very excited to have you on board.
            We are Happy to know that you are wont to be a part of over FAMILY , Please conform that your login from ${email} , If you are not then Change your account settings...`,
            action: {
                instructions: 'To join Any Events, please click here:',
                button: {
                    color: '#22BC66',
                    text: 'Join Event',
                    link: 'https://Google.com'
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    // Generate an HTML email with the provided contents
    var emailBody = mailGenerator.generate(email);

    // Generate the plaintext version of the e-mail (for clients that do not support HTML)
    var emailText = mailGenerator.generatePlaintext(email);

    require('fs').writeFileSync('preview.html', emailBody, 'utf8');
    require('fs').writeFileSync('preview.txt', emailText, 'utf8');
    console.log(process.env.EMAIL_FROM);

    transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: mail,
        subject: 'Youe login Activity conformation mail form EventManagement',
        html: emailBody,
        text: emailText,
    }, function (err) {
        if (err) return console.log(err);
        console.log('Welcome Message sent successfully.');
        transporter.close();
    });
}


const goodByEmail = (mail, name) => {

    var email = {
        body: {
            name: `Hii! ${name}`,
            intro: `Hello , ${name}
                
            Good Bye!
                It's not gone easy to forgot us, I hope we meet soon,See you soon..! ${email}`,
            action: {
                instructions: 'To join Any Events, please click here:',
                button: {
                    color: '#22BC66',
                    text: 'Join Event',
                    link: 'https://Google.com'
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    // Generate an HTML email with the provided contents
    var gbemailBody = mailGenerator.generate(email);

    // Generate the plaintext version of the e-mail (for clients that do not support HTML)
    var gbemailText = mailGenerator.generatePlaintext(email);

    require('fs').writeFileSync('preview.html', gbemailBody, 'utf8');
    require('fs').writeFileSync('preview.txt', gbemailText, 'utf8');

    transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: mail,
        subject: 'Your logout Activity conformation mail form EventManagement',
        html: gbemailBody,
        text: gbemailText,
    }, function (err) {
        if (err) return console.log(err);
        console.log('GoodBye Message sent successfully.');
        transporter.close();
    });
}


const eventEmail = (mail, name) => {

    var email = {
        body: {
            name: name,
            intro: `Welcome to Event-Menegment-Requests! We\'re very excited to have you on board.
            Please,Confirm that you are join event!,Now you are also part of Over family${email}...`,
            action: {
                instructions: 'To join Any Events, please click here:',
                button: {
                    color: '#22BC66',
                    text: 'Join Event',
                    link: 'https://Google.com'
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    // Generate an HTML email with the provided contents
    var eventemailBody = mailGenerator.generate(email);

    // Generate the plaintext version of the e-mail (for clients that do not support HTML)
    var eventemailText = mailGenerator.generatePlaintext(email);

    require('fs').writeFileSync('preview.html', eventemailBody, 'utf8');
    require('fs').writeFileSync('preview.txt', eventemailText, 'utf8');

    transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: mail,
        subject: 'Your Event Activity conformation mail form EventManagement',
        html: eventemailBody,
        text: eventemailText,
    }, function (err) {
        if (err) return console.log(err);
        console.log('Event Message sent successfully.');
        transporter.close();
    });
}


const invitationEmail = (mail, event, name) => {

    var email = {
        body: {
            name: `Hello, ${name}`,
            intro: `Welcome to Event-Menegment-Requests! We\'re very excited to have you on board.Please,Confirm that you are join event ${event}!,Now you are also part of Over family
            ${email} , for conform invitation click to agree for quick join...`,
            action: {
                instructions: 'To join Any Events, please click here',
                button: {
                    color: '#22BC66',
                    text: 'Join Event',
                    link: 'https://Google.com'
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    // Generate an HTML email with the provided contents
    var invitationemailBody = mailGenerator.generate(email);

    // Generate the plaintext version of the e-mail (for clients that do not support HTML)
    var invitationemailText = mailGenerator.generatePlaintext(email);

    require('fs').writeFileSync('preview.html', invitationemailBody, 'utf8');
    require('fs').writeFileSync('preview.txt', invitationemailText, 'utf8');

    transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: mail,
        subject: `Your ${event} Activity Invitation mail from EventMenagement`,
        html: emailBody,
        text: emailText,
    }, function (err) {
        if (err) return console.log(err);
        console.log('Invitation Message sent successfully.');
        transporter.close();
    });
}

module.exports = {
    welcomeEmail,
    goodByEmail,
    eventEmail,
    invitationEmail
};