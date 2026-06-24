import { useRef, useState } from "react";
import History from "./History";
import styles from "./Menu.module.css";

interface MenuProps {
    resetBoard: () => void;
    resetAll: () => void;
    results: { match: number, round: number, winner: ('X' | 'O' | null) }[];
    round: number;
}

const Menu = ({ resetBoard, resetAll, results, round }: MenuProps) => {
    const [showResults, setShowResults] = useState<boolean>(false);
    const [showResetDialog, setShowResetDialog] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const resetAllDialogRef = useRef<HTMLDialogElement>(null);
    const resetAllTitleRef = useRef<HTMLHeadingElement>(null);

    const closeHistory = () => {
        setTimeout(() => setShowResults(false), 200);
    }

    const closeResetDialog = () => {
        resetAllDialogRef.current?.classList.add("dialog--is-closing");
        setTimeout(() => {
            () => resetAllDialogRef.current?.close()
            setShowResetDialog(false);
        }, 200);
    }

    const openResetAll = () => {
        setShowResetDialog(true);
        setTimeout(() => {
            resetAllTitleRef.current?.focus();
            resetAllDialogRef.current?.showModal();
        }, 100);
    }

    const handleResetBoard = () => {
        resetBoard();
        menuRef.current?.hidePopover();
    }

    const handleResetAll = () => {
        resetAllDialogRef.current?.classList.add("dialog--is-closing");
        setTimeout(() => {
            resetAllDialogRef.current?.close();
            setShowResetDialog(false);
            resetAll();
        }, 200);
    }

    return (
        <>
            <div id="menu" className={styles.gameMenu} popover="" ref={menuRef}>
                <ul className="list-unstyled flex-column gap075">
                    <li>
                        <button className="btn" type="button"
                            onClick={() => setShowResults(true)} popoverTarget="menu"
                            popoverTargetAction="hide" aria-haspopup="dialog">
                            Show history
                        </button>
                    </li>
                    <li>
                        <button className="btn" type="button"
                            onClick={handleResetBoard} popoverTarget="menu"
                            popoverTargetAction="hide" disabled={round === 1}>
                            Reset board
                        </button>
                    </li>
                    <li>
                        <button className="btn btn-danger" onClick={openResetAll}
                            aria-haspopup="dialog"
                            popoverTarget="menu" popoverTargetAction="hide"
                            disabled={results.length === 0}>
                            Reset all
                        </button>
                    </li>
                </ul>
            </div>
            {showResetDialog &&
                <dialog id="resetAllDialog" className={styles.resetAllDialog}
                    ref={resetAllDialogRef} aria-labelledby="resetAllTitle"
                    onClose={closeResetDialog}>
                    <h2 id="resetAllTitle" ref={resetAllTitleRef} tabIndex={-1}>Reset board and history</h2>
                    <p>This action will permanently delete your current game and history.</p>
                    <ul className="list-unstyled flex-row gap05 w100">
                        <li>
                            <button className="btn btn-danger w100" onClick={handleResetAll}>Reset all</button>
                        </li>
                        <li>
                            <button className="btn w100" onClick={closeResetDialog}>Cancel</button>
                        </li>
                    </ul>
                </dialog>
            }
            {showResults &&
                <History results={results} onClose={closeHistory} />}
        </>
    );
}

export default Menu;