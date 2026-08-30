import { useEffect, useMemo, useState } from 'react'
import './App.css'

const questionBank = [
  {
    prompt: 'Which layer of the OSI model is responsible for routing between networks?',
    options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Session Layer'],
    correct: 'Network Layer',
  },
  {
    prompt: 'What does TCP guarantee that UDP does not?',
    options: ['Higher speed', 'Reliable delivery', 'Broadcasting', 'Encryption'],
    correct: 'Reliable delivery',
  },
  {
    prompt: 'Which network metric is used to measure round-trip delay?',
    options: ['Packet loss', 'RTT', 'Bandwidth', 'DNS ping'],
    correct: 'RTT',
  },
  {
    prompt: 'Why is a real-time quiz server adjusting timers for some clients?',
    options: ['To reduce fairness issues', 'To slow the server', 'To remove questions', 'To hide scores'],
    correct: 'To reduce fairness issues',
  },
]

const basePlayers = [
  { name: 'You', online: true, connected: true, latency: 48, packetLoss: 0.4, score: 0, role: 'player' },
  { name: 'Client A', online: true, connected: true, latency: 42, packetLoss: 0.1, score: 520, role: 'player' },
  { name: 'Client B', online: true, connected: true, latency: 187, packetLoss: 1.3, score: 460, role: 'player' },
  { name: 'Client C', online: false, connected: false, latency: 0, packetLoss: 0, score: 0, role: 'player' },
  { name: 'Client D', online: true, connected: true, latency: 210, packetLoss: 2.4, score: 485, role: 'player' },
]

const serverFeedTemplates = [
  'Client A answered correctly and gained +25 points.',
  'Packet ack gap detected on Client D.',
  'Adaptive timer increased by 1.8s for Client D.',
  'Leaderboard synced with the central score engine.',
  'RTT probe completed across all active clients.',
  'New round broadcast sent to all connected players.',
]

function App() {
  const [role, setRole] = useState('player')
  const [players, setPlayers] = useState(basePlayers)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(15)
  const [hasEnded, setHasEnded] = useState(false)
  const [protocolState, setProtocolState] = useState({
    tcp: true,
    udp: true,
    fairnessMode: 'Adaptive',
    fairnessLevel: 72,
    packetQueue: 146,
    droppedPackets: 9,
    tcpPackets: 312,
    udpPackets: 188,
    retransmissions: 14,
  })
  const [packetLog, setPacketLog] = useState([
    { id: 1, protocol: 'TCP', type: 'ACK', source: 'Client A', size: 1240 },
    { id: 2, protocol: 'UDP', type: 'QUESTION_SYNC', source: 'Server', size: 860 },
    { id: 3, protocol: 'TCP', type: 'SCORE_UPDATE', source: 'Client D', size: 420 },
  ])
  const [feed, setFeed] = useState([
    'Server online and accepting connections.',
    'Round started with fairness-based timer handling.',
    'Score sync completed across connected clients.',
  ])

  const currentQuestion = questionBank[Math.min(questionIndex, questionBank.length - 1)]

  const resetSession = () => {
    setPlayers(basePlayers)
    setQuestionIndex(0)
    setSelectedAnswer('')
    setTimeLeft(15)
    setHasEnded(false)
    setProtocolState((current) => ({
      ...current,
      packetQueue: 146,
      droppedPackets: 9,
      tcpPackets: 312,
      udpPackets: 188,
      retransmissions: 14,
    }))
    setPacketLog([
      { id: 1, protocol: 'TCP', type: 'ACK', source: 'Client A', size: 1240 },
      { id: 2, protocol: 'UDP', type: 'QUESTION_SYNC', source: 'Server', size: 860 },
      { id: 3, protocol: 'TCP', type: 'SCORE_UPDATE', source: 'Client D', size: 420 },
    ])
    setFeed([
      'Server online and accepting connections.',
      'Round started with fairness-based timer handling.',
      'Score sync completed across connected clients.',
    ])
  }

  useEffect(() => {
    if (hasEnded) return
    setSelectedAnswer('')
    setTimeLeft(15)
  }, [questionIndex, hasEnded])

  useEffect(() => {
    if (hasEnded || selectedAnswer !== '' || !currentQuestion) return

    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(timer)
          setFeed((prev) => [`Time expired. ${questionIndex >= questionBank.length - 1 ? 'Quiz finished.' : 'Moving to next question.'}`, ...prev].slice(0, 6))

          setTimeout(() => {
            setQuestionIndex((prev) => {
              if (prev >= questionBank.length - 1) {
                setHasEnded(true)
                return prev
              }

              return prev + 1
            })
          }, 800)
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [selectedAnswer, questionIndex, hasEnded])

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers((current) =>
        current.map((player) => {
          if (player.name === 'You') return player
          const latency = Math.max(20, Math.min(240, player.latency + Math.round((Math.random() - 0.5) * 22)))
          const packetLoss = Number(Math.max(0, Math.min(4.5, player.packetLoss + (Math.random() - 0.5) * 1.1)).toFixed(1))
          const online = player.name !== 'Client C' ? true : Math.random() > 0.25
          const connected = online

          return {
            ...player,
            latency,
            packetLoss,
            online,
            connected,
          }
        }),
      )

      setFeed((current) => {
        const next = serverFeedTemplates[Math.floor(Math.random() * serverFeedTemplates.length)]
        return [next, ...current].slice(0, 6)
      })

      setProtocolState((current) => {
        const tcpReceived = current.tcp ? Math.floor(Math.random() * 8) + 4 : 0
        const udpReceived = current.udp ? Math.floor(Math.random() * 7) + 2 : 0
        const packetDrop = Math.random() < 0.18 ? 1 : 0
        const retransmit = current.tcp && Math.random() < 0.22 ? 1 : 0

        return {
          ...current,
          packetQueue: Math.max(0, current.packetQueue + tcpReceived + udpReceived - Math.floor(Math.random() * 10)),
          droppedPackets: current.droppedPackets + packetDrop,
          tcpPackets: current.tcpPackets + tcpReceived,
          udpPackets: current.udpPackets + udpReceived,
          retransmissions: current.retransmissions + retransmit,
        }
      })

      setPacketLog((current) => {
        const tcpEnabled = protocolState.tcp
        const udpEnabled = protocolState.udp
        const protocol = tcpEnabled && udpEnabled
          ? (Math.random() > 0.45 ? 'TCP' : 'UDP')
          : tcpEnabled ? 'TCP' : 'UDP'
        const types = protocol === 'TCP'
          ? ['ACK', 'SCORE_UPDATE', 'RETRANSMIT']
          : ['QUESTION_SYNC', 'PRESENCE', 'HEARTBEAT']
        const nextPacket = {
          id: Date.now(),
          protocol,
          type: types[Math.floor(Math.random() * types.length)],
          source: protocol === 'TCP' ? 'Client D' : 'Server',
          size: protocol === 'TCP' ? Math.floor(Math.random() * 900) + 300 : Math.floor(Math.random() * 500) + 180,
        }
        return [nextPacket, ...current].slice(0, 5)
      })
    }, 2600)

    return () => clearInterval(interval)
  }, [protocolState.tcp, protocolState.udp])

  const leaderboard = useMemo(
    () => [...players].sort((a, b) => b.score - a.score).map((player, index) => ({ ...player, rank: index + 1 })),
    [players],
  )

  const playerViewPlayers = players.filter((player) => player.name !== 'You')
  const currentPlayer = players.find((player) => player.name === 'You')

  const handleAnswer = (option) => {
    if (selectedAnswer !== '' || !currentQuestion) return

    setSelectedAnswer(option)

    const correct = option === currentQuestion.correct
    if (correct) {
      setPlayers((current) =>
        current.map((player) =>
          player.name === 'You' ? { ...player, score: player.score + 100 } : player,
        ),
      )
      setFeed((prev) => ['You answered correctly. +100 points awarded.', ...prev].slice(0, 6))
    } else {
      setFeed((prev) => [`Incorrect answer submitted. Correct answer: ${currentQuestion.correct}.`, ...prev].slice(0, 6))
    }

    setTimeout(() => {
      setQuestionIndex((prev) => {
        if (prev >= questionBank.length - 1) {
          setHasEnded(true)
          setFeed((currentFeed) => ['Quiz completed. Final leaderboard generated.', ...currentFeed].slice(0, 6))
          return prev
        }

        return prev + 1
      })
    }, 1200)
  }

  const averageLatency = Math.round(players.reduce((sum, player) => sum + player.latency, 0) / players.length)
  const healthyPlayers = players.filter((player) => player.online).length
  const finalWinner = leaderboard[0]

  const setProtocolToggle = (key) => {
    setProtocolState((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  return (
    <div className="game-shell">
      <header className="game-header">
        <div className="title-group">
          <div className="logo-badge">CN</div>
          <div>
            <span className="eyebrow">Computer Networks Server</span>
            <h1>Quiz Fairness Engine</h1>
          </div>
        </div>

        <div className="header-actions">
          <div className="role-switch" aria-label="Role selector">
            <button
              type="button"
              className={role === 'player' ? 'role-btn active' : 'role-btn'}
              onClick={() => setRole('player')}
            >
              Player View
            </button>
            <button
              type="button"
              className={role === 'admin' ? 'role-btn active' : 'role-btn'}
              onClick={() => setRole('admin')}
            >
              Admin View
            </button>
          </div>
          <button type="button" className="ghost-btn" onClick={resetSession}>Restart Game</button>
          <button type="button" className="primary-btn">Broadcast Question</button>
        </div>
      </header>

      <main className="dashboard">
        <section className="stat-row">
          <div className="stat-card accent">
            <span>Active Players</span>
            <strong>{healthyPlayers}</strong>
          </div>
          <div className="stat-card">
            <span>{hasEnded ? 'Final Score' : 'Current Round'}</span>
            <strong>{hasEnded ? '#' + questionBank.length : '#' + (questionIndex + 1)}</strong>
          </div>
          <div className="stat-card">
            <span>Average RTT</span>
            <strong>{averageLatency} ms</strong>
          </div>
          <div className="stat-card">
            <span>Connection Health</span>
            <strong>{Math.round((healthyPlayers / players.length) * 100)}%</strong>
          </div>
        </section>

        <section className="main-grid">
          <div className="left-panel">
            <div className="panel question-panel">
              <div className="panel-head">
                <div>
                  <p className="panel-label">{hasEnded ? 'Session Result' : 'Live Match'}</p>
                  <h2>{hasEnded ? 'Final Results' : `Question ${questionIndex + 1}`}</h2>
                </div>
                <span className={hasEnded ? 'status-pill success' : 'status-pill'}>{hasEnded ? 'Finished' : 'Live'}</span>
              </div>

              {hasEnded ? (
                <div className="final-result-box">
                  <div className="winner-banner">
                    <span>Winner</span>
                    <strong>{finalWinner?.name ?? 'N/A'}</strong>
                  </div>

                  <div className="final-score-grid">
                    <div>
                      <small>Your Score</small>
                      <strong>{players.find((player) => player.name === 'You')?.score ?? 0} pts</strong>
                    </div>
                    <div>
                      <small>Top Score</small>
                      <strong>{finalWinner?.score ?? 0} pts</strong>
                    </div>
                    <div>
                      <small>Players</small>
                      <strong>{players.length}</strong>
                    </div>
                  </div>

                  <button type="button" className="primary-btn restart-btn" onClick={resetSession}>Play Again</button>
                </div>
              ) : (
                <>
                  <div className="timer-row">
                    <span className="timer-box">{timeLeft}s</span>
                    <span>Adaptive timer active</span>
                  </div>

                  <p className="question-text">{currentQuestion.prompt}</p>

                  <div className="option-grid">
                    {currentQuestion.options.map((option) => {
                      const isCorrect = option === currentQuestion.correct
                      const isChosen = option === selectedAnswer
                      const showCorrect = selectedAnswer !== '' && isCorrect
                      const showWrong = selectedAnswer !== '' && isChosen && !isCorrect

                      return (
                        <button
                          key={option}
                          type="button"
                          className={[
                            'option-btn',
                            showCorrect ? 'correct' : '',
                            showWrong ? 'wrong' : '',
                          ].join(' ')}
                          onClick={() => handleAnswer(option)}
                          disabled={selectedAnswer !== ''}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>

                  <div className="score-row">
                    <span>
                      Your Score: {players.find((player) => player.name === 'You')?.score ?? 0} pts
                    </span>
                    <span>{selectedAnswer === '' ? 'Waiting for answer...' : 'Answer submitted'}</span>
                  </div>
                </>
              )}
            </div>

            <div className="panel leaderboard-panel">
              <div className="panel-head">
                <div>
                  <p className="panel-label">Current Ranking</p>
                  <h2>Leaderboard</h2>
                </div>
                <span className="status-pill success">Updated</span>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Score</th>
                    <th>Conn</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player) => (
                    <tr key={player.name} className={player.name === 'You' ? 'self-row' : ''}>
                      <td>{player.rank}</td>
                      <td>{player.name}</td>
                      <td>{player.score} pts</td>
                      <td>{player.online ? 'Online' : 'Offline'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="right-panel">
            <div className="panel network-panel">
              <div className="panel-head">
                <div>
                  <p className="panel-label">Network Monitor</p>
                  <h2>{role === 'admin' ? 'Client Health' : 'My Connection'}</h2>
                </div>
                <span className="status-pill">Monitoring</span>
              </div>

              {role === 'admin' ? (
                <>
                  {players.map((player) => (
                    <div key={player.name} className="client-card">
                      <div className="client-row">
                        <span>{player.name}</span>
                        <span className={player.online ? 'chip good' : 'chip warn'}>
                          {player.online ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      <div className="metric-row">
                        <small>Connection</small>
                        <strong>{player.connected ? 'Connected' : 'Dropped'}</strong>
                      </div>
                      <div className="metric-row">
                        <small>RTT</small>
                        <strong>{player.latency} ms</strong>
                      </div>
                      <div className="metric-row">
                        <small>Loss</small>
                        <strong>{player.packetLoss}%</strong>
                      </div>
                      <div className="progress-bar">
                        <span style={{ width: `${Math.min(100, player.latency / 2.4)}%` }} />
                      </div>
                    </div>
                  ))}

                  <div className="admin-control-card">
                    <div className="control-header">
                      <span>Traffic Control</span>
                      <strong>{protocolState.fairnessMode}</strong>
                    </div>

                    <div className="toggle-row">
                      <button
                        type="button"
                        className={protocolState.tcp ? 'toggle-pill on' : 'toggle-pill off'}
                        onClick={() => setProtocolToggle('tcp')}
                      >
                        TCP {protocolState.tcp ? 'On' : 'Off'}
                      </button>
                      <button
                        type="button"
                        className={protocolState.udp ? 'toggle-pill on' : 'toggle-pill off'}
                        onClick={() => setProtocolToggle('udp')}
                      >
                        UDP {protocolState.udp ? 'On' : 'Off'}
                      </button>
                    </div>

                    <div className="packet-grid">
                      <div>
                        <small>Queue</small>
                        <strong>{protocolState.packetQueue}</strong>
                      </div>
                      <div>
                        <small>Dropped</small>
                        <strong>{protocolState.droppedPackets}</strong>
                      </div>
                      <div>
                        <small>Fairness</small>
                        <strong>{protocolState.fairnessLevel}%</strong>
                      </div>
                    </div>

                    <div className="slider-row">
                      <label htmlFor="fairness-level">Fairness level</label>
                      <input
                        id="fairness-level"
                        type="range"
                        min="0"
                        max="100"
                        value={protocolState.fairnessLevel}
                        onChange={(event) =>
                          setProtocolState((current) => ({
                            ...current,
                            fairnessLevel: Number(event.target.value),
                            fairnessMode: Number(event.target.value) > 70 ? 'Adaptive' : 'Balanced',
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="packet-stream-panel">
                    <div className="panel-head compact-head">
                      <div>
                        <p className="panel-label">Packet Monitor</p>
                        <h2>Traffic Flow</h2>
                      </div>
                    </div>

                    <div className="packet-flow-grid">
                      <div className="packet-flow-item">
                        <span>TCP</span>
                        <strong>{protocolState.tcpPackets}</strong>
                        <div className="mini-bar"><i style={{ width: `${Math.min(100, (protocolState.tcpPackets / 400) * 100)}%` }} /></div>
                      </div>
                      <div className="packet-flow-item">
                        <span>UDP</span>
                        <strong>{protocolState.udpPackets}</strong>
                        <div className="mini-bar"><i style={{ width: `${Math.min(100, (protocolState.udpPackets / 300) * 100)}%` }} /></div>
                      </div>
                      <div className="packet-flow-item">
                        <span>Retransmits</span>
                        <strong>{protocolState.retransmissions}</strong>
                        <div className="mini-bar"><i style={{ width: `${Math.min(100, (protocolState.retransmissions / 50) * 100)}%` }} /></div>
                      </div>
                    </div>

                    <div className="capture-list">
                      <div className="capture-list-head">
                        <span>Live capture</span>
                        <strong><i /> Collecting</strong>
                      </div>
                      {packetLog.map((packet) => (
                        <div key={packet.id} className="capture-row">
                          <span className={packet.protocol === 'TCP' ? 'protocol-tag tcp' : 'protocol-tag udp'}>{packet.protocol}</span>
                          <span className="capture-type">{packet.type}</span>
                          <span>{packet.source}</span>
                          <strong>{packet.size} B</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="client-card">
                    <div className="client-row">
                      <span>{currentPlayer?.name ?? 'You'}</span>
                      <span className={currentPlayer?.online ? 'chip good' : 'chip warn'}>
                        {currentPlayer?.online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <div className="metric-row">
                      <small>Connection</small>
                      <strong>{currentPlayer?.connected ? 'Connected' : 'Dropped'}</strong>
                    </div>
                    <div className="metric-row">
                      <small>RTT</small>
                      <strong>{currentPlayer?.latency ?? 0} ms</strong>
                    </div>
                    <div className="metric-row">
                      <small>Packet loss</small>
                      <strong>{currentPlayer?.packetLoss ?? 0}%</strong>
                    </div>
                  </div>

                  <div className="status-strip">
                    {playerViewPlayers.map((player) => (
                      <div key={player.name} className="status-line">
                        <span>{player.name}</span>
                        <span className={player.online ? 'chip good' : 'chip warn'}>
                          {player.online ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="panel feed-panel">
              <div className="panel-head">
                <div>
                  <p className="panel-label">Game Events</p>
                  <h2>Server Feed</h2>
                </div>
              </div>

              <ul className="feed-list">
                {feed.map((entry, index) => (
                  <li key={`${entry}-${index}`}>{entry}</li>
                ))}
              </ul>
            </div>
          </aside>
        </section>

        <section className="bottom-grid">
          <div className="panel control-panel">
            <div className="panel-head">
              <div>
                <p className="panel-label">Server Rules</p>
                <h2>Fairness Settings</h2>
              </div>
            </div>

            <div className="rules-grid">
              <div className="rule-box">
                <span>Latency Threshold</span>
                <strong>150 ms</strong>
              </div>
              <div className="rule-box">
                <span>Packet Loss Limit</span>
                <strong>2.0%</strong>
              </div>
              <div className="rule-box">
                <span>Timer Buffer</span>
                <strong>+1.8s</strong>
              </div>
              <div className="rule-box">
                <span>Sync Mode</span>
                <strong>Active</strong>
              </div>
            </div>
          </div>

          <div className="panel summary-panel">
            <div className="panel-head">
              <div>
                <p className="panel-label">Session Overview</p>
                <h2>Match Summary</h2>
              </div>
            </div>

            <div className="summary-grid">
              <div>
                <small>Winner</small>
                <strong>{leaderboard[0]?.name ?? 'N/A'}</strong>
              </div>
              <div>
                <small>Top Score</small>
                <strong>{leaderboard[0]?.score ?? 0} pts</strong>
              </div>
              <div>
                <small>Healthy Nodes</small>
                <strong>{players.filter((player) => player.online).length}/{players.length}</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
