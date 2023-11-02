import mail from "@sendgrid/mail"
export default async (htmlString: string, toDest: string[], subjectMail: string) => {
    const message: mail.MailDataRequired = {
        to: toDest,
        from: {
            name: 'E-Vote Admin',
            email: 'putuaryabhanu03@gmail.com'
        },
        subject: subjectMail,
        html: htmlString
    }
    try {
        const responseSent = await mail.send(message)
        return responseSent
    }
    catch (err) {
        throw err
    }
}