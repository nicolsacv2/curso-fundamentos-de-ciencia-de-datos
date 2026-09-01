/* The de Méré activity: write your name, bet on one of the two games, and throw as
   many rounds as you want. The dice are rolled by the backend — a single source of
   truth for the whole class — and every answer comes back with the SVG already drawn
   (sixes and double sixes in red). See docs/apis/. */

import { useState, useEffect, useRef } from 'react';
import {
  registerPlayer, chooseGame, throwRound, getGamesSummary,
  subscribeSummary, isMock, isNonProd, ENV
} from './api.js';

const GAMES = [
  {
    key: 'one-die-4',
    name: 'Juego 1',
    rule: 'Un dado, 4 tiros. Ganas si sale al menos un 6.'
  },
  {
    key: 'two-dice-24',
    name: 'Juego 2',
    rule: 'Dos dados, 24 tiros. Ganas si sale al menos un doble 6.'
  }
];

export default function DiceActivity() {
  const [name, setName] = useState('');
  const [player, setPlayer] = useState(null);
  const [render, setRender] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  /* The shared marcador. Every screen in the room polls, so a round thrown by anyone
     shows up here within a couple of seconds — which is the whole reason the backend
     exists. The same poll reports WHICH class is running: when the instructor stops the
     activity or opens a new one, this screen throws away its player and its board and
     goes back to the name, instead of carrying a stale player into a class it does not
     belong to. */
  /* The round this screen is showing. A ref, not state: the poll reads it on every tick
     and must not restart the subscription every time it changes. */
  const lastRound = useRef(null);

  useEffect(() => subscribeSummary((data, reset) => {
    if (reset) {
      lastRound.current = null;
      setPlayer(null);
      setName('');
      setError(data.session ? '' : 'La actividad terminó.');
    }
    setRender(data.render);
  }, { round: () => lastRound.current }), []);

  const run = async fn => {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const enter = () => run(async () => {
    const { player: p } = await registerPlayer(name, 'demere');
    setPlayer(p);
  });

  const pick = game => run(async () => {
    const { player: p } = await chooseGame(player.id, game);
    setPlayer(p);
  });

  const throwOnce = () => run(async () => {
    const { render: r, round } = await throwRound(player.chosen_game, player.id);
    /* Remembered so the poll keeps drawing it: otherwise the next tick, two seconds
       from now, would replace these dice with a board that has no round on it. */
    lastRound.current = round.id;
    setRender(r);
  });

  const marcador = () => run(async () => {
    lastRound.current = null;
    const { render: r } = await getGamesSummary();
    setRender(r);
  });

  const chosen = GAMES.find(g => g.key === player?.chosen_game);

  return (
    <div className="activity">
      {!player && (
        <form className="controls" onSubmit={e => { e.preventDefault(); if (name.trim()) enter(); }}>
          <label htmlFor="dice-name">Tu nombre</label>
          <input
            id="dice-name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="como quieras aparecer en el marcador"
            maxLength={40}
          />
          <button type="submit" className="act" disabled={busy || !name.trim()}>Entrar</button>
        </form>
      )}

      {player && !player.chosen_game && (
        <div className="choice">
          <p className="hint">{player.name}, apuesta una moneda: ¿con cuál juego te la jugarías?</p>
          <div className="pickers">
            {GAMES.map(g => (
              <button key={g.key} type="button" className="pick" disabled={busy} onClick={() => pick(g.key)}>
                <span className="k">{g.name}</span>
                <span className="d">{g.rule}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {chosen && (
        <div className="controls">
          <p className="hint"><b>{player.name}</b> apuesta con el <b>{chosen.name.toLowerCase()}</b>. {chosen.rule}</p>
          <button type="button" className="act" disabled={busy} onClick={throwOnce}>
            {busy ? 'Lanzando…' : 'Lanzar'}
          </button>
          <button type="button" className="ghost" disabled={busy} onClick={marcador}>
            Marcador de la clase
          </button>
        </div>
      )}

      {error && <p className="err" role="alert">{error}</p>}

      {render && (
        <div className="canvas" dangerouslySetInnerHTML={{ __html: render }} />
      )}

      {isNonProd() && (
        <p className="mode">Entorno {ENV}: esta ronda no cuenta para la clase real.</p>
      )}
      {isMock('demere') && (
        <p className="mode">Modo local: sin conexión con la API de la clase, el marcador solo cuenta lo lanzado en esta pantalla.</p>
      )}
    </div>
  );
}
