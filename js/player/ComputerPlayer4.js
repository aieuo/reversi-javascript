import {ComputerPlayer2} from "./ComputerPlayer2.js";

// パスさせようとする
export class ComputerPlayer4 extends ComputerPlayer2 {

    getScore(board, color) {
        return board.getMovablePositions(-color).length;
    }
}