export class Board {

    static stone = {"black": 1, "white": -1, "empty": 0};
    static stone_html = {"black": '<span class="stone black">●</span>', "white": '<span class="stone white">●</span>'};
    static colorToString = (color) => color === Board.stone.black ? "black" : "white";

    board = [];
    size = 8;

    element;

    constructor(boardElement, size) {
        this.element = boardElement;
        this.size = size;
    }

    clone() {
        const board = new Board(this.element, this.size);
        board.board = JSON.parse(JSON.stringify(this.board));
        return board;
    }

    initBoard(game) {
        this.element.innerHTML = "";
        for (let x = 0; x < this.size; x++) {
            const row = document.createElement("div");
            const board_row = [];
            row.classList.add("row");
            for (let y = 0; y < this.size; y++) {
                const col = document.createElement("div");
                col.classList.add("column");
                col.onclick = () => {
                    game.player.black.onClick(game, x, y);
                    game.player.white.onClick(game, x, y);
                };

                row.appendChild(col);
                board_row.push(Board.stone.empty);
            }
            this.element.appendChild(row);
            this.board.push(board_row);
        }

        const center = Math.floor(this.size / 2);
        this.changeStone(center, center - 1, Board.stone.black);
        this.changeStone(center - 1, center, Board.stone.black);
        this.changeStone(center, center, Board.stone.white);
        this.changeStone(center - 1, center - 1, Board.stone.white);
    }

    changeStone(x, y, color, applyUI = true) {
        this.board[x][y] = color

        if (applyUI) {
            const col = this.element.children[x].children[y];
            col.innerHTML = Board.stone_html[Board.colorToString(color)];
        }
    }

    existsStone(x, y) {
        if (!(x in this.board) || !(y in this.board[x])) return false
        return this.board[x][y] !== Board.stone.empty;
    }

    isColor(x, y, color) {
        if (!(x in this.board) || !(y in this.board[x])) return false
        return this.board[x][y] === color;
    }

    place(x, y, color, applyUI = true) {
        let placed = false;
        const blocks = this.getNeighborStones(x, y, color);
        for(let block of blocks) {
            const count = this.getFlippableStoneCount(x, y, block.x - x, block.y - y, color);
            if(count <= 0) continue;

            placed = this.flipStones(x, y, block.x - x, block.y - y, count, color, applyUI);
        }
        return placed;
    }

    getNeighborStones(x, y, color) {
        if (this.existsStone(x, y)) return [];

        let result = [];
        for (let i = x - 1; i <= x + 1; i++) {
            if (!(i in this.board)) continue;

            for (let j = y - 1; j <= y + 1; j++) {
                if (!(j in this.board[i])) continue;

                if (this.board[i][j] === -color) result.push({"x": i, "y": j});
            }
        }
        return result;
    }

    getMovablePositions(color) {
        const pos = [];
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                let placed = false;

                const stones = this.getNeighborStones(x, y, color);
                for (let stone of stones) {
                    const count = this.getFlippableStoneCount(x, y, stone.x - x, stone.y - y, color);
                    if (count > 0) placed = true;
                }
                if (placed) pos.push({"x": x, "y": y});
            }
        }
        return pos;
    }

    getFlippableStoneCount(x, y, dx, dy, color) {
        let count = 0;
        let found = false;
        for (let i = 0; i < this.size; i++) {
            x += dx;
            y += dy;
            if (!(x in this.board && y in this.board[x])) break;

            if (this.board[x][y] === color) found = true;
            if (this.board[x][y] === color || this.board[x][y] === Board.stone.empty) break;
            count++;
        }
        if (!found) count = 0;
        return count;
    }

    flipStones(x, y, dx, dy, count, color, applyUI = true) {
        for (let i = 0; i <= count; i++) {
            if (x in this.board && y in this.board[x]) {
                this.changeStone(x, y, color, applyUI);
            }
            x += dx;
            y += dy;
        }
        return true;
    }

    isPass(color) {
        let total = 0;
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                const stones = this.getNeighborStones(x, y, color);
                for (let stone of stones) {
                    total += this.getFlippableStoneCount(x, y, stone.x - x, stone.y - y, color);
                }
            }
        }
        return total <= 0;
    }

    countStones() {
        let black = 0;
        let white = 0;
        for (let x = 0; x < this.size; x++) {
            for (let z = 0; z < this.size; z++) {
                if (this.board[x][z] === Board.stone.black) black++;
                if (this.board[x][z] === Board.stone.white) white++;
            }
        }
        return {"black": black, "white": white};
    }

}