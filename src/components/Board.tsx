import type { Player } from "../types";
import Square from "./Square";
import styles from "./Board.module.css";

interface BoardProps {
    squares: (Player | null)[];
    onSquareClick: (i: number) => void;
    isGameOver: boolean;
}

const Board = ({ squares, onSquareClick, isGameOver }: BoardProps) => {
    return (
        <div className={styles.boardWrapper}>
            <ul className={`list-unstyled ${styles.board}`} aria-label="Tic-tac-toe board">
                <Square value={squares[0]} onSquareClick={() => onSquareClick(0)} isDisabled={isGameOver} squareInfo='square 1' />
                <Square value={squares[1]} onSquareClick={() => onSquareClick(1)} isDisabled={isGameOver} squareInfo='square 2' />
                <Square value={squares[2]} onSquareClick={() => onSquareClick(2)} isDisabled={isGameOver} squareInfo='square 3' />
                <Square value={squares[3]} onSquareClick={() => onSquareClick(3)} isDisabled={isGameOver} squareInfo='square 4' />
                <Square value={squares[4]} onSquareClick={() => onSquareClick(4)} isDisabled={isGameOver} squareInfo='square 5' />
                <Square value={squares[5]} onSquareClick={() => onSquareClick(5)} isDisabled={isGameOver} squareInfo='square 6' />
                <Square value={squares[6]} onSquareClick={() => onSquareClick(6)} isDisabled={isGameOver} squareInfo='square 7' />
                <Square value={squares[7]} onSquareClick={() => onSquareClick(7)} isDisabled={isGameOver} squareInfo='square 8' />
                <Square value={squares[8]} onSquareClick={() => onSquareClick(8)} isDisabled={isGameOver} squareInfo='square 9' />
            </ul>
        </div>
    );
}

export default Board;