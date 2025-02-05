import { ChangeEvent, useEffect, useRef, useState } from 'react';
import MOCK_WORDS from './mock-data';

interface KeyboardEvent {
    code: string;
}

function App() {
    const [inputValue, setInputValue] = useState<string>('');
    const [isFocused, setIsFocused] = useState(true);
    const [wordsArray, setWordsArray] = useState<string[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        shuffleWordsArray();

        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.code) {
                case 'Escape':
                    pauseGame();
                    break;
                case 'Space':
                    resumeGame();
                    break;
                case 'KeyR':
                    if (isFocused || !inputRef.current?.value) return;

                    restartGame();
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    const shuffleWordsArray = () => {
        const shuffledWords = MOCK_WORDS.sort(() => Math.random() - 0.5);

        setWordsArray(shuffledWords);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);

        // Check if the user has typed all the words and restart the game
        if (inputValue.length === wordsArray.join(' ').length - 1) {
            restartGame();
        }
    };

    const pauseGame = () => {
        setIsFocused(false);

        inputRef.current?.blur();
    };

    const resumeGame = () => {
        setTimeout(() => {
            setIsFocused(true);

            inputRef.current?.focus();
        }, 1);
    };

    const restartGame = () => {
        shuffleWordsArray();
        setInputValue('');
        resumeGame();

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <>
            <div className="flex justify-center items-center bg-[#323437] absolute top-0 left-0 right-0 bottom-0 z-10 px-5 text-white text-4xl text-center max-w-lg mx-auto lg:hidden">
                <div>
                    We're sorry, but this website is <span className="text-emerald-300">best viewed</span> on a{' '}
                    <span className="text-emerald-300">PC or laptop</span>. Please switch to one of these devices for
                    the <span className="text-emerald-300">optimal experience</span>.
                </div>
            </div>

            <input
                className="visually-hidden"
                type="text"
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />

            <div className="px-60 py-36 hidden lg:block">
                <div className="relative">
                    <div
                        className={`${
                            isFocused ? '' : 'blur-sm pointer-events-none'
                        } text-4xl tracking-wide text-[#d1d0c5] transition-all`}>
                        {wordsArray
                            .join(' ')
                            .split('')
                            .map((character, index) => (
                                <span
                                    className={`${
                                        inputValue.charAt(index) &&
                                        (character === inputValue.charAt(index) ? '' : 'text-red-500')
                                    } ${inputValue.length === index ? 'current-character' : ''} ${
                                        index <= inputValue.length ? 'opacity-100' : 'opacity-35'
                                    }`}
                                    key={index}>
                                    {character}
                                </span>
                            ))}
                    </div>

                    {!isFocused && (
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-5xl font-bold cursor-pointer hover:text-emerald-300 transition-colors duration-150"
                            onClick={resumeGame}>
                            Click here to start !
                        </div>
                    )}
                </div>

                <div className="mt-20">
                    {isFocused ? (
                        <p className="text-white text-2xl">
                            Press <span className="text-emerald-300 font-bold">Escape</span> to pause the game.
                        </p>
                    ) : (
                        <>
                            <p className="text-white text-2xl">
                                Press <span className="text-emerald-300 font-bold">Space</span> to resume the game.
                            </p>

                            {inputRef.current?.value && (
                                <p className="text-white text-2xl mt-2">
                                    Press <span className="text-emerald-300 font-bold">R</span> to restart the game.
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default App;
