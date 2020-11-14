import {Player} from "./player/Player.js";
import {Board} from "./Board.js";

export class Game {
    turn = Board.stone.black;
    player = {"black": null, "white": null};
    pass = {"black": false, "white": false};

    count = 4;
    max = 64;

    board;

    constructor(player1, player2, board) {
        this.player.black = player1;
        this.player.white = player2;
        this.board = board;
        this.max = board.size * board.size;
    }

    clone() {
        return new Game(this.player.black, this.player.white, this.board.clone());
    }

    isTurn(color) {
        return color === this.turn;
    }

    start() {
        this.board.initBoard(this);

        this.player.black.setTurnMessage("黒の番です");
        this.player.white.setTurnMessage("黒の番です");
        this.player.black.onTurn(this);
    }

    next(pass = false) {
        if (!pass) {
            this.count ++;
            this.pass[Board.colorToString(this.turn)] = false;
        } else {
            this.pass[Board.colorToString(this.turn)] = true;
        }

        if ((this.count >= this.max) || (this.pass.black && this.pass.white)) {
            this.finish();
            return;
        }

        this.turn *= -1;
        const color = this.turn === Board.stone.black ? "黒" : "白";

        this.player.black.setTurnMessage(`${color}の番です`);
        this.player.white.setTurnMessage(`${color}の番です`);

        if (this.board.isPass(this.turn)) {
            this.broadcastMessage(`${color}は置ける場所がないのでパスしました`);
            this.next(true);
            return;
        }

        this.player[Board.colorToString(this.turn)].onTurn(this);
    }

    broadcastMessage(message) {
        const player1 = this.player.black;
        const player2 = this.player.white;

        if ((player1 instanceof Player && player1 instanceof Player) || !(player1 instanceof Player && player1)) {
            (new Player("")).sendMessage(message);
        } else {
            player1.sendMessage(message);
            player2.sendMessage(message);
        }
    }

    finish() {
        const count = this.board.countStones();
        const black = count.black;
        const white = count.white;

        this.player.black.setTurnMessage("終了");
        this.player.white.setTurnMessage("終了");

        if (black > white) {
            this.broadcastMessage(`${black}対${white}で黒の勝ちです`);
        } else if (black === white) {
            this.broadcastMessage(`${black}対${white}で引き分けです`);
        } else {
            this.broadcastMessage(`${black}対${white}で白の勝ちです`);
        }

        document.getElementById("start_game").disabled = false;
    }
}