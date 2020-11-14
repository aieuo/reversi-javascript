export class BasePlayer {
    color;

    constructor(color) {
        this.color = color;
    }

    place(game, x, y) {
        const placed = game.board.place(x, y, this.color);

        if(!placed) {
            console.log(`${x} ${y}`);
            this.sendMessage("その場所には置けません");
        } else {
            game.next();
        }
    }

    onClick(game, x, y) {
    }

    onTurn(game) {
    }

    sendMessage(message) {
        console.log(message);
    }

    setTurnMessage(message) {
        document.getElementById("message").innerText = message;
    }
}