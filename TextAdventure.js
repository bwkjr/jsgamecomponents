import { useState, useEffect } from 'react';
const NEXT_PUBLIC_OPENAI_KEY = 'your-api-key-here';
const getBackgroundStory = async () => {
    const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NEXT_PUBLIC_OPENAI_KEY}`,
      },
      body: JSON.stringify({
        prompt: 'In the world of Dungeons and Dragons, a brave adventurer embarks on a quest. Describe the adventurer\'s background, including their upbringing, profession, and any notable events that shaped their character.',
        max_tokens: 200,
        n: 1,
        stop: null,
        temperature: 0.7,
      }),
    });
  
    const data = await response.json();
    const story = data.choices[0].text.trim();
    return story;
  };
  
  const sendActionToGpt = async (action) => {
    const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NEXT_PUBLIC_OPENAI_KEY}`,
      },
      body: JSON.stringify({
        prompt: `You are a GPT-4 powered Dungeon Master in a Dungeons and Dragons text-based game. Your role is to guide the player through the adventure, providing descriptions, controlling non-player characters, and managing the game world. [User]: ${action}\n[Dungeon Master]: `,
        max_tokens: 100,
        n: 1,
        stop: ["[User]:", "[Dungeon Master]:"],
        temperature: 0.5,
      }),
    });
  
    const data = await response.json();
    return data.choices[0].text.trim();
  };
  

const TextAdventure = () => {
  const [userInput, setUserInput] = useState('');
  const [gameHistory, setGameHistory] = useState([]);
  const [backgroundStory, setBackgroundStory] = useState('');

  useEffect(() => {
    (async () => {
      const story = await getBackgroundStory();
      setBackgroundStory(story);
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput) return;

    setGameHistory([...gameHistory, { text: userInput, type: 'user' }]);
    setUserInput('');

    const response = await sendActionToGpt(userInput);
    setGameHistory([...gameHistory, { text: userInput, type: 'user' }, { text: response, type: 'dm' }]);
  };

  return (
    <div>
      <h2>Background Story</h2>
      <p>{backgroundStory}</p>
      <h2>Ground Rules</h2>
      <p>
        1. Describe your actions in detail. <br />
        2. Your choices have consequences, so think carefully before making decisions. <br />
        3. To interact with characters or objects, mention them explicitly in your actions. <br />
        4. Have fun and immerse yourself in the adventure!
      </p>
      <h2>Game Conversation</h2>
      {gameHistory.map((entry, index) => (
        <div key={index} className={`entry ${entry.type}`}>
          <strong>{entry.type === 'user' ? 'You' : 'Dungeon Master'}:</strong> {entry.text}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your action..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default TextAdventure;
