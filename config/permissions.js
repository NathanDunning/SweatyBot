if (process.env.NODE_ENV === 'production') {
  module.exports = {
    Admin: '260312174973550592',
    Mods: '694762697039937587',
    Nisties: '547992648850341903',
    Verified: '700609994772578365',
    Everyone: '244095507033489408',
  };
} else {
  module.exports = {
    Admin: '802851782941999113',
    Mods: '802851782941999112',
    Nisties: '802851782941999109',
    Verified: '802851782941999108',
    Everyone: '802851782941999105',
  };
}
