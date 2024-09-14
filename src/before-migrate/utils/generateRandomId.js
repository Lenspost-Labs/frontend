// --------
// Function to generate a random Alphanumeric ID
// Params : idLength - Length of the ID to be generated
// --------

export const randomId = (idLength) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < idLength; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}