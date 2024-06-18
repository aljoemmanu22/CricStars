import React from 'react';

function PlayerSelectionOverlay({
  battingTeamPlayers,
  bowlingTeamPlayers,
  striker,
  setStriker,
  nonStriker,
  setNonStriker,
  selectedBowler,
  setSelectedBowler,
  handleStartScoring,
  missingInfo,
  updatePlayerInfo,
  handleBatterChange,
  setNewBowler,
  handleBowlerChange
}) {
  const BATTING_STYLE_CHOICES = [
    ['Right-handed', 'Right-handed'],
    ['Left-handed', 'Left-handed'],
  ];

  const BOWLING_STYLE_CHOICES = [
    ['Right-arm fast', 'Right-arm fast'],
    ['Right-arm medium', 'Right-arm medium'],
    ['Left-arm fast', 'Left-arm fast'],
    ['Left-arm medium', 'Left-arm medium'],
  ];

  const ROLE_CHOICES = [
    ['Batsman', 'Batsman'],
    ['Bowler', 'Bowler'],
    ['All-Rounder', 'All-Rounder'],
    ['Wicketkeeper', 'Wicketkeeper'],
  ];

  const handleStrikerChange = (e) => {
    const selectedPlayer = JSON.parse(e.target.value);
    setStriker(selectedPlayer);
  };
  
  const handleNonStrikerChange = (e) => {
    const selectedPlayer = JSON.parse(e.target.value);
    setNonStriker(selectedPlayer);
  };
  
  const handleBowlerChanges = (e) => {
    const selectedPlayer = JSON.parse(e.target.value);
    setSelectedBowler(selectedPlayer);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 overflow-hidden p-4">
      <div className="bg-gray-800 p-8 rounded shadow-lg text-white max-w-md w-full max-h-full overflow-y-auto">
        <h1 className="text-2xl mb-4">Select Players</h1>
        {console.log(striker)}
        {striker.id === '' && striker.name === '' && (
          <>
            <label className="block mb-2">Striker Batsman</label>
            <select className="mb-4 p-2 rounded bg-gray-700" value={JSON.stringify(striker)} onChange={e => handleBatterChange(JSON.parse(e.target.value), false)}>
              <option value="">Select Striker Batsman</option>
              {battingTeamPlayers.filter(player => !player.is_batted).map(player => (
                <option key={player.id} value={JSON.stringify({ id: player.id, name: player.name })}>{player.name}</option>
              ))}
            </select>
          </>
        )}

        {nonStriker.id === '' && nonStriker.name === '' && (
          <>
            <label className="block mb-2">Non-Striker Batsman</label>
            <select className="mb-4 p-2 rounded bg-gray-700" value={JSON.stringify(nonStriker)} onChange={e => handleBatterChange(JSON.parse(e.target.value), true)}>
              <option value="">Select Non-Striker Batsman</option>
              {battingTeamPlayers.filter(player => !player.is_batted && player.id !== (striker.id || "")).map(player => (
                <option key={player.id} value={JSON.stringify({ id: player.id, name: player.name })}>{player.name}</option>
              ))}
            </select>
          </>
        )}
        {console.log('this is',bowlingTeamPlayers)}
        {selectedBowler.id === '' && selectedBowler.name === '' && (
          <>
            <label className="block mb-2">Bowler</label>
            <select className="mb-4 p-2 rounded bg-gray-700" value={JSON.stringify(selectedBowler)} onChange={e => handleBowlerChange(JSON.parse(e.target.value))}>
              <option value="">Select Bowler</option>
              {selectedBowler != null ? 
                bowlingTeamPlayers.map(player => (
                  <option key={player.id} value={JSON.stringify({ id: player.id, name: player.name })}>{player.name}</option>
                ))
                : bowlingTeamPlayers.filter(player => player.id === (selectedBowler.id)).map(player => (
                  <option key={player.id} value={JSON.stringify({ id: player.id, name: player.name })}>{player.name}</option>
                ))
              }

              
            </select>
          </>
        )}

        
        {missingInfo && missingInfo.length > 0 && (
          <div className="text-white">
            <h2 className="text-xl mb-4">Update Player Information</h2>
            {missingInfo.map(player => (
              <div key={player.id} className="mb-4">
                <p className="mb-2">{player.name}</p>

                <label className="block mb-2">Role</label>
                <select 
                  className="mb-2 p-2 rounded bg-gray-700"
                  value={player.role} 
                  onChange={e => updatePlayerInfo(player.id, e.target.value, player.batting_style, player.bowling_style)} 
                >
                  <option value="">Select Role</option>
                  {ROLE_CHOICES.map(role => (
                    <option key={role[0]} value={role[0]}>{role[1]}</option>
                  ))}
                </select>

                <label className="block mb-2">Batting Style</label>
                <select 
                  className="mb-2 p-2 rounded bg-gray-700"
                  value={player.batting_style} 
                  onChange={e => updatePlayerInfo(player.id, player.role, e.target.value, player.bowling_style)} 
                >
                  <option value="">Select Batting Style</option>
                  {BATTING_STYLE_CHOICES.map(style => (
                    <option key={style[0]} value={style[0]}>{style[1]}</option>
                  ))}
                </select>

                <label className="block mb-2">Bowling Style</label>
                <select 
                  className="p-2 rounded bg-gray-700"
                  value={player.bowling_style} 
                  onChange={e => updatePlayerInfo(player.id, player.role, player.batting_style, e.target.value)} 
                >
                  <option value="">Select Bowling Style</option>
                  {BOWLING_STYLE_CHOICES.map(style => (
                    <option key={style[0]} value={style[0]}>{style[1]}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
        <div className='flex items-center justify-center'>
          <button 
            className="bg-green-500 text-white p-2 rounded mt-4"
            onClick={handleStartScoring}
          >
            Start Scoring
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayerSelectionOverlay;
