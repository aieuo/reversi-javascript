import {BasePlayer} from "./BasePlayer.js";

export class Player extends BasePlayer {

    onClick(game, x, y) {
        if (!game.isTurn(this.color)) return;
        if (game.board.existsStone(x, y)) return;

        this.place(game, x, y);
    }

    sendMessage(message) {
        const textarea = document.getElementById("message_area");
        textarea.textContent += ("\n" + message);
        textarea.scrollTop = textarea.scrollHeight;
    }
}