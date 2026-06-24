import type { Player } from '../types'
import { useState } from "react";
import Board from './Board';
import Menu from './Menu';
import GameResultModal from './GameResultModal';
import Score from './Score';
import styles from './Game.module.css'

const Game = () => {
    const [match, setMatch] = useState<number>(1);
    const [round, setRound] = useState<number>(1);
    const [xIsNext, setXIsNext] = useState<boolean>(true);
    const [squares, setSquares] = useState<(Player | null)[]>(Array(9).fill(null));
    const [results, setResults] = useState<{ match: number, round: number, winner: ('X' | 'O' | null) }[]>([]);
    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
    const [gameResultIsOpen, setGameResultIsOpen] = useState<boolean>(false);
    const [isResetting, setIsResetting] = useState<boolean>(false);
    const [toasts, setToasts] = useState<{ id: string, message: string }[]>([]);

    const winner = calculateWinner(squares);
    const draw = !winner && squares.every(s => s !== null);

    const handleSquareClick: (i: number) => void = (i) => {
        if (squares[i] || draw || winner) return;

        const newSquares = [...squares];
        newSquares[i] = xIsNext ? 'X' : 'O';
        setSquares(newSquares);

        const newWinner = calculateWinner(newSquares);
        const newDraw = !winner && newSquares.every(s => s !== null);
        if (!newWinner && !newDraw) {
            setXIsNext(!xIsNext);
            setRound(prev => Math.min(prev + 1, 9));
        }

        if (newWinner || newDraw) {
            setGameResultIsOpen(true);
            setResults(prev => [...prev, { match: match, round: round, winner: newWinner }]);
        }

        if ('vibrate' in navigator) navigator.vibrate(200);
    }

    const hideGameResult = () => {
        setGameResultIsOpen(false);
    }

    const resetBoard = (toastMessage = "Board reset") => {
        setGameResultIsOpen(false);
        setIsResetting(true);
        setRound(1);
        setXIsNext(true);
        if (winner || draw) setMatch(prev => prev + 1);
        setTimeout(() => {
            setSquares(Array(9).fill(null));
            setIsResetting(false);
        }, 250);
        addToast(toastMessage);
    }

    const resetAll = () => {
        resetBoard("Board and score reset");
        setResults([]);
        setMatch(1);
    }

    const addToast = (m: string) => {
        const toastId = generateId();
        setToasts(prev => [...prev, { id: toastId, message: m }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toastId)), 10000);
    }

    return (
        <>
            <div className={styles.game} {...(isResetting && { 'data-state': 'game--resetting' })}>
                {((winner || draw) && gameResultIsOpen)
                    &&
                    <GameResultModal winner={winner} onRestartClick={resetBoard} onSeeBoard={hideGameResult} />
                }
                <h1 className='sr-only'>Tic tac toe</h1>
                <div className={styles.gameWrapper}>
                    <header className={styles.gameHeader}>
                        <ul className={`list-unstyled ${styles.dataWrapper}`}>
                            <li className={styles.roundWrapper}>
                                <div className='sr-only'
                                    aria-live='polite' aria-atomic="true">
                                    {(round > 1 && (!winner && !draw)) ? `Current round: ${round}` : ''}
                                </div>
                                <div aria-hidden="true">
                                    <h3 className={styles.title}>Round</h3>
                                    <div className={styles.roundListWrapper}>
                                        <ul className={styles.roundList} style={{
                                            '--r': `${round}`
                                        } as React.CSSProperties}>
                                            <li className={round === 1 ? styles.current : ''}>1</li>
                                            <li className={round === 2 ? styles.current : ''}>2</li>
                                            <li className={round === 3 ? styles.current : ''}>3</li>
                                            <li className={round === 4 ? styles.current : ''}>4</li>
                                            <li className={round === 5 ? styles.current : ''}>5</li>
                                            <li className={round === 6 ? styles.current : ''}>6</li>
                                            <li className={round === 7 ? styles.current : ''}>7</li>
                                            <li className={round === 8 ? styles.current : ''}>8</li>
                                            <li className={round === 9 ? styles.current : ''}>9</li>
                                        </ul >
                                    </div >
                                </div>
                            </li >
                            <li className={styles.playerWrapper}>
                                <div className='sr-only'
                                    aria-live='polite' aria-atomic="true">
                                    {(round > 1 && (!winner && !draw)) ? `Current player: ${xIsNext ? 'x' : 'o'}` : ''}
                                </div>
                                <div aria-hidden="true">
                                    <h3 className={styles.title}>{winner ? 'Winner' : 'Player'}</h3>
                                    <div className={styles.playerListWrapper}>
                                        <ul className={styles.playerList} data-currentplayer={xIsNext ? "x" : "o"} style={{ '--p': `${xIsNext ? 1 : 2}` } as React.CSSProperties}>
                                            <li className={styles.player}>
                                                <span className='icon iconX'></span>
                                            </li>
                                            <li className={styles.player}>
                                                <span className='icon iconO'></span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        </ul >
                        <button className={`btn ${styles.menuBtn}`}
                            onClick={() => setMenuIsOpen(!menuIsOpen)}
                            popoverTarget='menu' type="button"
                            aria-label='Open menu'>
                            <span className="icon iconMenu" aria-hidden="true" role="img"></span>
                        </button>
                    </header >
                    <Menu resetBoard={resetBoard} resetAll={resetAll} results={results} round={round} />
                    <Board squares={squares} onSquareClick={handleSquareClick} isGameOver={!!winner} />
                    <Score results={results} />
                </div>
            </div >
            <div className={styles.toastList}
                role="region" aria-live='polite' aria-label="Notifications">
                <ul className='list-unstyled flex-column gap05'>
                    {toasts.map(t =>
                        <li className={styles.toast} key={t.id}>
                            <button
                                onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))}>
                                <span className='icon iconCheck' aria-hidden="true"></span>
                                <span className={styles.message}>{t.message}</span>
                            </button>
                        </li>)}

                </ul>
            </div>
        </>
    );
}

export default Game;

const calculateWinner: (squares: (Player | null)[]) => (Player | null) = (squares) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

const generateId = (): string =>
    typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;