import { useEffect, useRef } from "react";
import type { Player } from "../types";
import styles from "./GameResultModal.module.css";
// @ts-ignore
import confetti from "canvas-confetti";

interface GameResultModalProps {
    winner: Player | null;
    onRestartClick: (toastMessage: string) => void;
    onSeeBoard: () => void;
}

const GameResultModal = ({ winner, onRestartClick, onSeeBoard }: GameResultModalProps) => {
    const gameResultRef = useRef<HTMLDialogElement>(null);
    const gameResultTitleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const gameResultDialog = gameResultRef.current;
        if (!gameResultDialog) return;
        gameResultTitleRef.current?.focus();
        const timer = setTimeout(() => {
            gameResultDialog.showModal();
        }, 400);
        if (!winner) return;
        confetti({
            origin: { y: 1.1 },
            disableForReducedMotion: true
        });

        return () => {
            clearTimeout(timer);
        };
    }, [winner]);

    const handleSeeBoard = () => {
        gameResultRef.current?.classList.add("dialog--is-closing");
        setTimeout(() => {
            gameResultRef.current?.close();
            onSeeBoard();
        }, 200);
    }

    const handleClose = () => {
        handleSeeBoard();
        onRestartClick("New game started");
    }

    return (
        <>
            <title>{winner ? `${winner} wins!` : "Draw!"}</title>
            <dialog ref={gameResultRef} className={styles.gameResult}
                onCancel={handleSeeBoard} aria-labelledby="gameResultTitle">
                <div className={styles.gameResultWrapper}>
                    <h2 className={styles.title} id="gameResultTitle" ref={gameResultTitleRef}
                        tabIndex={-1}>
                        {winner
                            ? `Player ${winner} wins!`
                            : `Draw!`}
                    </h2>
                    <span className={styles.img} role="img"
                        aria-label={winner ? 'Trophy' : 'Handshake'}>
                        {winner
                            ? `\u{1F3C6}`
                            : `\u{1F91D}`}
                    </span>
                    <ul className="list-unstyled flex-column gap05 w100">
                        <li>
                            <button className="btn btn-primary w100"
                                onClick={handleClose} aria-haspopup="dialog">Play again</button>
                        </li>
                        <li>
                            <button className="btn btn-secondary w100"
                                onClick={handleSeeBoard} aria-haspopup="dialog">See board</button>
                        </li>
                    </ul>
                </div>
            </dialog>
        </>
    );
}

export default GameResultModal;