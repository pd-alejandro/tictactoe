import { useEffect, useRef } from "react";
import styles from './History.module.css'

interface HistoryProps {
    results: { match: number, round: number, winner: ('X' | 'O' | null) }[];
    onClose: () => void;
}

const History = ({ results, onClose }: HistoryProps) => {
    const historyTitleRef = useRef<HTMLHeadingElement>(null);
    const historyRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (!historyRef.current) return;

        historyRef.current.showModal();
    }, [results]);

    const handleClose = () => {
        historyRef.current?.classList.add("dialog--is-closing");
        setTimeout(() => {
            historyRef.current?.close();
            onClose()
        }, 200);
    }

    const xVictories = results.filter(r => r.winner === "X").length;
    const oVictories = results.filter(r => r.winner === "O").length;

    return (<>
        <title>{xVictories !== oVictories
            ? `Top leader: ${xVictories > oVictories ? "X" : "O"}`
            : "Keep on playing!"}</title>
        <dialog ref={historyRef} id="history-dialog" onCancel={handleClose} className={styles.history} aria-labelledby="history-title">
            <div className={styles.historyWrapper}>
                <h2 id="history-title" ref={historyTitleRef} tabIndex={-1}>History</h2>
                {results.length !== 0 ?
                    <div className={styles.historyListWrapper}>
                        <ul className="list-unstyled">
                            {results.toReversed().map(r =>
                                <li key={r.match}>
                                    {
                                        <>
                                            <span className="sr-only">{`Match ${r.match}, ${r.winner ? `${r.winner} won` : "Draw"}`}</span>
                                            <span className={styles.listMatch} aria-hidden="true">#{r.match}</span>
                                            <span aria-hidden="true">{r.winner ? `${r.winner} won` : "Draw"}</span>
                                        </>
                                    }
                                </li>
                            )}
                        </ul>
                    </div>
                    :
                    <p>No games yet!</p>}
                <button type="button" className="btn w100" onClick={handleClose}>Close</button>
            </div>
        </dialog>
    </>);
}

export default History;