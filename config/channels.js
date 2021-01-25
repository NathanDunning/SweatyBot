if (process.env.NODE_ENV === 'production') {
  module.exports = {
    serverupdates: { id: '723024789966553090', botAllow: true },
    serversuggestions: { id: '716796932114219018', botAllow: true },
    rolereact: {
      id: '722970514070700032',
      botAllow: true,
      messages: {
        roles: '722972576384679976',
      },
    },
    general: { id: '244095507033489408', botAllow: false },
    stockexchange: { id: '749779259190673458', botAllow: true },
    commands: { id: '259228078490910721', botAllow: true },
    moderationchat: { id: '700618271942115368', botAllow: false },
    newmembers: { id: '700618185933848576', botAllow: true },
    testcommands: { id: '694764131147972689', botAllow: true },
    testgeneral: { id: '698760455191003176', botAllow: true },
  };
} else {
  module.exports = {
    serverupdates: { id: '802851783385808898', botAllow: true },
    serversuggestions: { id: '802851783385808899', botAllow: true },
    rolereact: {
      id: '802851783385808900',
      botAllow: true,
      messages: {
        roles: '802855780146872350',
      },
    },
    general: { id: '802851783385808902', botAllow: false },
    stockexchange: { id: '802851783385808903', botAllow: true },
    commands: { id: '802851783385808904', botAllow: true },
    moderationchat: { id: '802851783688978465', botAllow: false },
    newmembers: { id: '802851783688978466', botAllow: true },
    testcommands: { id: '802851783688978469', botAllow: true },
    testgeneral: { id: '802851783688978470', botAllow: true },
  };
}
