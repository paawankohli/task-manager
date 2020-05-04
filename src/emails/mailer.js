const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.sgAPIKey)

const sendWelcomeEmail = (name, email) => {
    const msg = {
        to: email,
        from: 'paawan.kohli10@gmail.com',
        subject: `Welcome to Task Manager, ${name}`,
        text: `Hey, it's Paawan Kohli and I'm glad to have you on this platform. Hope to see you manage a lot of tasks!`
    }

    sgMail.send(msg)
    .then(r => console.log(`Sent welcome E-Mail to ${name} on ${email}`))
    .catch(e => console.log(`Unable to send the email`, e.response.body))
}

const sendLeavingEmail = (name, email) => {
    const msg = {
        to: email,
        from: 'paawan.kohli10@gmail.com',
        subject: `Good Bye, ${name}`,
        text: `Hey, it's Paawan Kohli (for the last time) and I'm sorry to see you leave our task manager app. Help us improve by telling us what made you leave!`
    }

    sgMail.send(msg)
    .then(r => console.log(`Sent leaving E-Mail to ${name} on ${email}`))
    .catch(e => console.log(`Unable to send the email`, e.response.body))
}

module.exports = {
    sendWelcomeEmail,
    sendLeavingEmail
}