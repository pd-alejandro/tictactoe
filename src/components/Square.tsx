import type { Player } from '../types';
import styles from "./Square.module.css";

interface SquareProps {
    value: Player | null;
    onSquareClick: () => void;
    isDisabled: boolean;
    squareInfo: string;
}

const Square = ({ value, onSquareClick, isDisabled, squareInfo }: SquareProps) => {
    return (
        <li>
            <button
                className={`${styles.square} ${value && "x"}`}
                onClick={onSquareClick}
                aria-disabled={!!value || isDisabled}
                aria-label={`${squareInfo}, ${!value ? 'empty' : value}`}>
                {value
                    &&
                    <span
                        className={`icon ${`icon` + value}`}
                        aria-hidden="true"
                        role="img">
                    </span>}
            </button >
        </li>
    );
}

export default Square;