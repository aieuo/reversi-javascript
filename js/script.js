import {Board} from "./Board.js";
import {Player} from "./player/Player.js";
import {Game} from "./Game.js";
import {ComputerPlayer1} from "./player/ComputerPlayer1.js";
import {ComputerPlayer2} from "./player/ComputerPlayer2.js";
import {ComputerPlayer3} from "./player/ComputerPlayer3.js";
import {ComputerPlayer4} from "./player/ComputerPlayer4.js";
import {ComputerPlayer5} from "./player/ComputerPlayer5.js";

const getPlayer = (type, color) => {
    switch (type) {
        case "player":
            return new Player(color);
        case "com1":
            return new ComputerPlayer1(color);
        case "com2":
            return new ComputerPlayer2(color);
        case "com3":
            return new ComputerPlayer3(color);
        case "com4":
            return new ComputerPlayer4(color);
        case "com5":
            return new ComputerPlayer5(color);
    }
    return null;
}

document.getElementById("start_game").onclick = () => {
    document.getElementById("start_game").disabled = true;

    const size = document.getElementById("board_size").value;
    const player1Type = document.getElementById("player1").value;
    const player2Type = document.getElementById("player2").value;
    const player1 = getPlayer(player1Type, Board.stone.black);
    const player2 = getPlayer(player2Type, Board.stone.white);

    if (player1 === null || player2 === null) {
        alert("プレイヤーが見つかりません");
        return;
    }
    if (size < 4) {
        alert("サイズは4以上で入力してください");
        return;
    }

    const game = new Game(player1, player2, new Board(document.getElementById("board"), size));
    game.start();
}