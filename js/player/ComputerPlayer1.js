import {BasePlayer} from "./BasePlayer.js";

// ランダム
export class ComputerPlayer1 extends BasePlayer {

    onTurn(game) {
        const sleep = time => new Promise(resolve => setTimeout(resolve, time));
        (async () => {
            await sleep(50);
            let pos = this.findPlace(game.board);
            await sleep(50);

            if (typeof pos.x === "undefined") pos = new ComputerPlayer1(this.color).findPlace(game.board);
            this.place(game, pos.x, pos.y);
        })();
    }

    findPlace(board) {
        let positions = [];

        for (let x = 0; x < board.size; x++) {
            for (let y = 0; y < board.size; y++) {
                let board_tmp = board.clone();
                if (board_tmp.place(x, y, this.color, false)) positions.push({"x": x, "y": y});
            }
        }

        return positions[Math.floor(Math.random() * positions.length)];
    }
}