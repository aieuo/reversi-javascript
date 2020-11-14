import {ComputerPlayer2} from "./ComputerPlayer2.js";
import {Board} from "../Board.js";

const timeoutFirst = 1000;
const timeout = 500;

// https://github.com/na-o-ys/othello-ai/blob/master/src/ai/index.ts
export class ComputerPlayer5 extends ComputerPlayer2 {

    findPlace(board) {
        const movables = board.getMovablePositions(this.color);
        const start = Date.now();
        const stones = board.countStones();
        const count = stones.black + stones.white;
        const full = (board.size * board.size) - count - 1 <= 10;

        let max = -123456789;
        let max_pos = {};
        const result = {"win": 0, "lose": 0};

        for (let depth = 3; Date.now() - start <= timeout; depth++) {
            let tle = false;
            const scores = [];
            for (const position of movables) {
                const boardTmp = board.clone();
                if (!boardTmp.place(position.x, position.y, this.color, false)) continue;

                let score;
                if (full) {
                    score = -this.fullSearch(boardTmp, -this.color, result, -100000, 100000);
                } else {
                    score = -this.alphaBeta(boardTmp, -this.color, count + 1, depth - 1, -100000, 100000);
                }
                scores.push({"score": score, "pos": position});

                if (!full && Date.now() - start > (depth === 3 ? timeoutFirst : timeout)) {
                    tle = true;
                    break;
                }
            }
            if (tle) break;
            for (const score of scores) {
                if (score.score > max) {
                    max = score.score;
                    max_pos.x = score.pos.x;
                    max_pos.y = score.pos.y;
                }
            }
            if (full) {
                if (result.lose === 0) {
                    console.log("勝った");
                } else if (result.win === 0) {
                    console.log("負けた");
                } else {
                    console.log("勝つ確率: " + (result.win / (result.win + result.lose) * 100))
                }
                break;
            }
        }
        return max_pos;
    }

    alphaBeta(board, color, count, depth, a, b) {
        if (depth <= 0 || count >= board.size * board.size) return this.getScore(board, color);

        const movables = board.getMovablePositions(color);
        if (movables.length === 0) return -this.alphaBeta(board, -color, count, depth - 1, -b, -a);

        for (const position of movables) {
            const boardTmp = board.clone();
            if (!boardTmp.place(position.x, position.y, color, false)) continue;

            a = Math.max(a, -this.alphaBeta(boardTmp, -color, count + 1, depth - 1, -b, -a));
            if (a >= b) return a;
        }
        return a;
    }

    fullSearch(board, color, result, a, b, pass = 0) {
        const count = board.countStones();
        if (pass > 1 || count.black + count.white === board.size * board.size) {
            const diff = count[Board.colorToString(color)] - count[Board.colorToString(-color)];
            (count[Board.colorToString(this.color)] - count[Board.colorToString(-this.color)]) > 0 ? result.win++ : result.lose++;
            return diff;
        }

        const movables = board.getMovablePositions(color);
        if (movables.length === 0) return -this.fullSearch(board, -color, result, -b, -a, pass + 1);

        for (const position of movables) {
            const boardTmp = board.clone();
            if (!boardTmp.place(position.x, position.y, color, false)) continue;

            a = Math.max(a, -this.fullSearch(boardTmp, -color, result, -b, -a, pass));
            if (a >= b) return a;
        }
        return a;
    }
}