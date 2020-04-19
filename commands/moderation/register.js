const { dbQuery } = require('../../config/configHandler.js')
module.exports = {
    name: 'register',
    description: 'Registers a nistie to the server',
    guildOnly: true,
    async execute(client, message) {
        const isNistie = message.member.roles.cache.get('547992648850341903');

        if (isNistie) {
            const selectQuery = {
                text: 'SELECT user_id FROM users WHERE user_id = $1',
                values: [message.member.id]
            }
            dbQuery(selectQuery).then(async res => {
                const dmChannel = await message.author.createDM()
                if (res.rows.length) {
                    dmChannel.send("You are already registered")
                } else {
                    function ProcessName(message) {
                        data.set('Name', message.last().content);
                    }
                    function ProcessSurname(message) {
                        data.set('Surname', message.last().content);
                    }
                    function ProcessGradYear(message) {
                        data.set('Gradyear', message.last().content);
                    }
                    function ProcessError(err) {
                        console.log(err);
                        return dmChannel.send("Sorry but an error occured somewhere, please let a mod know")
                    }

                    const data = new Map();

                    // First Name
                    await dmChannel.send(`1. What is your first name?`);
                    await dmChannel
                        .awaitMessages(
                            (m) => {
                                return !m.author.bot;
                            },
                            { max: 1, time: 60000, errors: ['time'] }
                        )
                        .then(ProcessName)
                        .catch(ProcessError);

                    // Last Name
                    await dmChannel.send(`2. What is your last name?`);
                    await dmChannel
                        .awaitMessages(
                            (m) => {
                                return !m.author.bot;
                            },
                            { max: 1, time: 60000, errors: ['time'] }
                        )
                        .then(ProcessSurname)
                        .catch(ProcessError);

                    // Grad Year
                    await dmChannel.send(`3. What was your graduation year?`);
                    await dmChannel
                        .awaitMessages(
                            (m) => {
                                return !m.author.bot;
                            },
                            { max: 1, time: 60000, errors: ['time'] }
                        )
                        .then(ProcessGradYear)
                        .catch(ProcessError);


                    dmChannel.send("Saving your response...")
                    const insertQuery = {
                        text: 'INSERT INTO users (user_id, discord_tag, name, surname, nistie, grad_year) VALUES ($1, $2, $3, $4, $5, $6)',
                        values: [message.member.id, message.author.tag, data.get("Name"), data.get("Surname"), true, data.get("Gradyear")]
                    }
                    dbQuery(insertQuery).then(res => {
                        if (res.rows) {
                            dmChannel.send("Registration done, thanks!")
                        }
                    }).catch(ProcessError)
                }
            })
        } else {
            message.channel.send(
                "Sorry but you don't have the role: Nisties"
            );
        }
    },
};
