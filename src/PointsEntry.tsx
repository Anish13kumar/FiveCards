import React, { useEffect, useState } from "react";

interface Props {
  playerCount: number;
  totalScore: number;
}

interface IPlayer {
  name: string;
  point: number;
  totalPoint?: number;
  currentPoint?: number;
  previousPoint?: number;
  propershow?: number;
}

export default function PointsEntry({ playerCount, totalScore }: Props) {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  // const [finalOutput, setFinalOutput] = useState([]);
  const [log, setlog] = useState([]);
  const [clone, setClone] = useState<IPlayer[]>([]);
  const [winState, setWinState] = useState([]);
  const [loseState, setLoseState] = useState([]);
  const [winMapper, setWinMapper] = useState();
  const [loseMapper, setLoseMapper] = useState();

  const userwinStatus: string[] = [];
  const userloseStatus: string[] = [];

  const wrongShowPoint = 50;

  useEffect(() => {
    // Initialize an empty array to hold the new players
    const newPlayers = [];

    for (let index = 0; index < playerCount; index++) {
      // Using synchronous prompt to collect player names
      const playerName =
        prompt(`Enter name for player ${index + 1}`) || `Player ${index + 1}`;
      newPlayers.push({ name: playerName, point: 0 });
    }

    // Update the state once with all new players
    setPlayers(newPlayers);

    // Cleanup function to reset players when component unmounts or before next effect runs
    return () => {
      setPlayers([]);
    };
  }, []); // Dependency array ensures this effect runs only when playerCount changes

  const submitRound = () => {
    const roundPoint: {
      name: string;
      point: number;
      totalPoint: number;
      currentPoint: number;
    }[] = [];
    players.map((player, index) => {
      let iE = document.getElementById(`$player${index}`)?.value;
      player.point += +iE;
      roundPoint.push({
        name: player.name,
        point: player.point,
        totalPoint: player.point,
        currentPoint: +iE,
        previousPoint: +(player.point - iE),
        propershow: +iE === 0 && index + 1,
        exited: player.point >= totalScore ? true : false,
      });

      console.log(roundPoint);
      if (+iE === 0 && !roundPoint[index]?.exited) {
        userwinStatus.push(player.name);
      }
      if (+iE === wrongShowPoint && !roundPoint[index]?.exited) {
        userloseStatus.push(player.name);
      }

      console.log({ userwinStatus });
      document.getElementById(`$player${index}`).value = parseInt(0, 10);
    });
    // setFinalOutput(roundPoint);
    setClone([...roundPoint]);
    setlog((prev) => [...prev, roundPoint]);
    setWinState((prev) => [...prev, ...userwinStatus]);
    setLoseState((prev) => [...prev, ...userloseStatus]);
  };

  useEffect(() => {
    const countOccurrences = (arr) => {
      return arr.reduce((acc, player) => {
        acc[player] = (acc[player] || 0) + 1;
        return acc;
      }, {});
    };

    const playerCounts = countOccurrences(winState);
    setWinMapper(playerCounts);
  }, [winState]);

  useEffect(() => {
    const countOccurrences = (arr) => {
      return arr.reduce((acc, player) => {
        acc[player] = (acc[player] || 0) + 1;
        return acc;
      }, {});
    };

    const playerCounts = countOccurrences(loseState);
    console.log({ playerCounts });
    setLoseMapper(playerCounts);
  }, [loseState]);

  return (
    <>
      <main className="main-area">
        <section className="player-info">
          <h2 className="Leaderboard-title">Player List</h2>
          {players.map((player, index) => (
            <React.Fragment key={index}>
              <p>
                <label>
                  <span className="playerName">{player.name} Points: </span>{" "}
                  <input
                    type="number"
                    id={`$player${index}`}
                    min="0"
                    defaultValue={0}
                    disabled={player.point >= totalScore}
                  />
                </label>
              </p>
              {/* <p>{player.point}</p> */}
            </React.Fragment>
          ))}
          <button onClick={submitRound}>Submit</button>
        </section>
        <section className="Leaderboard">
          <h2 className="Leaderboard-title">Leaderboard</h2>
          <table>
            <tr>
              <th>Player Points</th>
              <th>Win</th>
              <th>Wrong Show</th>
            </tr>
            {clone
              .sort((a, b) => b.totalPoint - a.totalPoint)
              .map((x: IPlayer, index) => {
                return (
                  <>
                    <tr>
                      <td>
                        <h3>
                          <span className="playerName">{x.name} :</span>{" "}
                          <span className="wrongShow">
                            {x.totalPoint} points{" "}
                          </span>{" "}
                          (Remaining:{" "}
                          <span className="winner">
                            {totalScore - x?.totalPoint}
                          </span>
                          )
                        </h3>
                      </td>
                      <td>
                        <span
                          className={
                            winMapper[x.name] ? "winnerMapper" : undefined
                          }
                        >
                          {winMapper[x.name]}
                        </span>
                      </td>
                      <td>
                        {" "}
                        <span
                          className={
                            loseMapper[x.name] ? "loseMapper" : undefined
                          }
                        >
                          {loseMapper[x.name]}
                        </span>
                      </td>
                    </tr>
                  </>
                );
              })}
          </table>
        </section>
      </main>
      <section className="main-logs">
        <h2 className="spacing">Points Log</h2>

        <div className="logs">
          {log.map((x: IPlayer, index) => {
            return (
              <section className="roundData-Main">
                <h3>Round {index + 1}</h3>
                <hr />
                <div className="roundData">
                  {x?.map((y, i) => {
                    return (
                      <>
                        {!(y.totalPoint >= totalScore) && (
                          <p
                            key={i}
                            className={
                              (y.currentPoint === 0 ? "winner" : undefined) ||
                              (y.currentPoint === wrongShowPoint
                                ? "wrongShow"
                                : undefined)
                            }
                          >
                            {y.name} : {y.previousPoint} + {y.currentPoint}{" "}
                            points
                          </p>
                        )}
                        {/* {y.currentPoint === 0 && <p className="winner">winner: {y.name} </p>} */}
                      </>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </>
  );
}
