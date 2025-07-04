import React, { useEffect, useState, useRef } from "react";
import "./Pitch.css";

const initialPlayers = [
  { id: 1, team: "A", x: 20, y: 30 },
  { id: 2, team: "A", x: 40, y: 50 },
  { id: 3, team: "B", x: 60, y: 30 },
  { id: 4, team: "B", x: 70, y: 60 },
];

const Pitch = () => {
  const [players, setPlayers] = useState(initialPlayers);
  
  const [ball, setBall] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState({ A: 0, B: 0 });
  const [teamNames] = useState({ A: "Team A", B: "Team B" });
  

  const [event, setEvent] = useState(null);

  const [history, setHistory] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(null);
  const [isLive, setIsLive] = useState(true);

  const intervalRef = useRef(null);
  const r = Math.random();
  if (r < 0.15) {
    const scoringTeam = Math.random() > 0.5 ? "A" : "B";
    setScore((prev) => ({
      ...prev,
      [scoringTeam]: prev[scoringTeam] + 1,
    }));
    setEvent(`GOAL - ${teamNames[scoringTeam]}!`);
    setTimeout(() => setEvent(null), 2000);
  }
  

  useEffect(() => {
    if (!isLive) return;

    intervalRef.current = setInterval(() => {
      setPlayers((prev) => {
        const updated = prev.map((p) => ({
          ...p,
          x: Math.max(0, Math.min(100, p.x + (Math.random() * 10 - 5))),
          y: Math.max(0, Math.min(100, p.y + (Math.random() * 10 - 5))),
        }));
        return updated;
      });

      setBall((prev) => ({
        x: Math.max(0, Math.min(100, prev.x + (Math.random() * 10 - 5))),
        y: Math.max(0, Math.min(100, prev.y + (Math.random() * 10 - 5))),
      }));

      const r = Math.random();
      if (r < 0.15) {
        setEvent("GOAL - Team A!");
        setTimeout(() => setEvent(null), 2000);
      }

    
      setHistory((prev) => {
        const newFrame = {
          timestamp: Date.now(),
          players: JSON.parse(JSON.stringify(players)),
          ball: { ...ball },
          score: { ...score },
        };
        return [...prev.slice(-20), newFrame];
      });
      
    }, 2000);

    return () => clearInterval(intervalRef.current);
  }, [isLive, players, ball]);

  const handleTimelineChange = (index) => {
    const frame = history[index];
    if (frame) {
      setIsLive(false);
      setCurrentFrame(index);
      setPlayers(frame.players);
      setBall(frame.ball);
      setScore(frame.score);
    }
  };
  

  const handleResumeLive = () => {
    setIsLive(true);
    setCurrentFrame(null);
  };

  return (
    <div className="pitch-wrapper">
      <div className="pitch">
         

  <div className="center-line"></div>
  <div className="center-circle"></div>
  <div className="goal-box goal-left"></div>
  <div className="goal-box goal-right"></div>

  <div className="scoreboard">
  <div className="team-name">{teamNames.A}</div>
  <div className="score">{score.A} - {score.B}</div>
  <div className="team-name">{teamNames.B}</div>
</div>

        {players.map((p) => (
          <div
            key={p.id}
            className={`player ${p.team === "A" ? "team-a" : "team-b"}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
          />
        ))}
        <div
          className="ball"
          style={{
            left: `${ball.x}%`,
            top: `${ball.y}%`,
          }}
        />
        {event && <div className="event-banner">{event}</div>}
      </div>

      <div className="timeline-controls">
        <input
          type="range"
          min={0}
          max={history.length - 1}
          value={currentFrame ?? history.length - 1}
          onChange={(e) => handleTimelineChange(Number(e.target.value))}
        />
        {!isLive && (
          <button className="resume-btn" onClick={handleResumeLive}>
            Resume Live
          </button>
        )}
      </div>
    </div>
  );
};

export default Pitch;
