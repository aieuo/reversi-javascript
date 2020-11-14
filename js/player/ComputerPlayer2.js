import {ComputerPlayer1} from "./ComputerPlayer1.js";
import {Board} from "../Board.js";

export class ComputerPlayer2 extends ComputerPlayer1 {

    scores = [
        [ 90, -30, 15,  5],
        [-30, -60, -1, -1],
        [ 15,  -1, 15, -1],
        [  5,  -1, -1, -1],
    ];

    findPlace(board) {
        let max = -123456789;
        let max_pos = {};

        for (let x = 0; x< board.size; x++) {
            for (let y = 0; y< board.size; y++) {
                let boardTmp = board.clone();
                if (!boardTmp.place(x, y, this.color, false)) continue;

                const score = this.getScore(boardTmp, this.color);
                if (score > max) {
                    max = score;
                    max_pos.x = x;
                    max_pos.y = y;
                }
            }
        }

        return max_pos;
    }

    getStoneScores(board) {
        let black = 0;
        let white = 0;
        const center = Math.floor(board.size / 2);
        for (let x = 0; x < board.size; x++) {
            for (let y = 0; y < board.size; y++) {
                const score_x = x < center ? x : board.size - x - 1;
                const score_y = y < center ? y : board.size - y - 1;
                if (score_x in this.scores && score_y in this.scores[score_x]) {
                    if (board.isColor(x, y, Board.stone.black)) {
                        black += this.scores[score_x][score_y];
                    } else if(board.isColor(x, y, Board.stone.white)) {
                        white += this.scores[score_x][score_y];
                    }
                }
            }
        }
        return {"black": black, "white": white};
    }

    getScore(board, color) {
        const movable = board.getMovablePositions(-color).length * 3;
        const scores = this.getStoneScores(board);
        console.log(`${movable} ${scores[Board.colorToString(color)] - scores[Board.colorToString(-color)]}`);
        return ((scores[Board.colorToString(color)] - scores[Board.colorToString(-color)])) - movable;
    }
}