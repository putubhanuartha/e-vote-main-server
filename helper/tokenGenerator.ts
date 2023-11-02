function tokenGenerator() {
    let token = '';
    const digits = '0123456789';
    for (let i = 0; i < 5; i++) {
        token += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return token;
}
export default tokenGenerator
