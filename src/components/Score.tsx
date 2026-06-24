import { useEffect, useState } from "react";
import styles from "./Score.module.css";

interface ScoreProps {
    results: { match: number, round: number, winner: ('X' | 'O' | null) }[];
}

const ScoreCounter = ({ value }: { value: number }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (value !== displayValue) {
            setIsAnimating(true);

            const timer = setTimeout(() => {
                setDisplayValue(value);
                setIsAnimating(false);
            }, 200);

            return () => clearTimeout(timer);
        }
    }, [value, displayValue]);

    const inlineStyles = {
        "--y": isAnimating ? "100%" : "0%",
        "--speed": isAnimating ? "0.1s" : "0s"
    } as React.CSSProperties;

    return (
        <div className={styles.scoreItemValue} aria-hidden="true">
            <div className={styles.scoreSlot} style={inlineStyles}>
                {(displayValue !== 0 && value === 0) ? 0 : displayValue + 1}
            </div>
            <div className={styles.scoreSlot} style={inlineStyles}>
                {displayValue}
            </div>
        </div>
    );
};

const Score = ({ results }: ScoreProps) => {
    const xVictories = results.filter(r => r.winner === "X").length;
    const oVictories = results.filter(r => r.winner === "O").length;
    const draws = results.filter(r => !r.winner).length;

    return (
        <div className={styles.score} role="group">
            <div className={styles.scoreWrapper}>
                <h2 className="sr-only">Score</h2>
                <ul className={styles.scoreList}>
                    <li>
                        <span className="sr-only">{`Player X victories, ${xVictories}`}</span>
                        <h3 className={styles.scoreItemTitle} aria-hidden="true">Player X</h3>
                        <ScoreCounter value={xVictories} />
                    </li>
                    <li>
                        <span className="sr-only">{`Draws, ${draws}`}</span>
                        <h3 className={styles.scoreItemTitle} aria-hidden="true">Draws</h3>
                        <ScoreCounter value={draws} />
                    </li>
                    <li>
                        <span className="sr-only">{`Player O victories, ${oVictories}`}</span>
                        <h3 className={styles.scoreItemTitle} aria-hidden="true">Player O</h3>
                        <ScoreCounter value={oVictories} />
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Score;