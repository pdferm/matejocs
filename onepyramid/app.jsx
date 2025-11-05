// Adaptación 'Opción A' sin imports externos (no shadcn, no Tailwind).
// Mantiene la lógica de tu archivo original pero con elementos nativos.
const { useState } = React;

const validCombinations = {
  3: [
    ['x', 'y', 'z'], ['x', 'y', 'b'], ['x', 'a', 'b'], ['x', 'a', 'c'], ['y', 'b', 'c'], ['x', 'z', 'b']
  ],
  4: [
    ['x1', 'x2', 'x3', 'x4'], ['x1', 'x2', 'x3', 'b2'], ['x1', 'x2', 'x4', 'b1'],
    ['x1', 'a1', 'a2', 'a3'], ['x2', 'a1', 'b1', 'c'], ['x2', 'x3', 'b1', 'c'], ['x1', 'x3', 'x4', 'c']
  ]
};

function generateBase(order, range, allowNegatives) {
  const min = allowNegatives ? -range : 0;
  const max = range;
  return Array.from({ length: order }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}

function buildPyramid(order, base) {
  let levels = [base];
  while (levels[0].length > 1) {
    const prev = levels[0];
    const next = Array.from({ length: prev.length - 1 }, (_, i) => prev[i] + prev[i + 1]);
    levels.unshift(next);
  }
  return levels; // de arriba a abajo
}

function PyramidGenerator() {
  const [order, setOrder] = useState(3);
  const [range, setRange] = useState(10);
  const [allowNeg, setAllowNeg] = useState(false);
  const [mode, setMode] = useState('random');
  const [pyramid, setPyramid] = useState([]);
  const [knownPositions, setKnownPositions] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const [showSolution, setShowSolution] = useState(false);
  const [checkAnswers, setCheckAnswers] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const generate = () => {
    const base = generateBase(order, range, allowNeg);
    const levels = buildPyramid(order, base);
    const combo = mode === 'base'
      ? (order === 3 ? ['x', 'y', 'z'] : ['x1', 'x2', 'x3', 'x4'])
      : validCombinations[order][Math.floor(Math.random() * validCombinations[order].length)];
    setPyramid(levels);
    setKnownPositions(combo);
    setUserInputs({});
    setShowSolution(false);
    setCheckAnswers(false);
    setIsCorrect(null);
  };

  const handleInputChange = (key, value) => {
    if (!checkAnswers) {
      setUserInputs(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleCheckAnswers = () => {
    setCheckAnswers(true);
    if (!pyramid.length) return;

    let allCorrect = true;
    const map3 = [['c'], ['a', 'b'], ['x', 'y', 'z']];
    const map4 = [['c'], ['b1', 'b2'], ['a1', 'a2', 'a3'], ['x1', 'x2', 'x3', 'x4']];

    for (let levelIndex = 0; levelIndex < pyramid.length; levelIndex++) {
      for (let i = 0; i < pyramid[levelIndex].length; i++) {
        const posId = order === 3 ? map3[levelIndex][i] : map4[levelIndex][i];
        if (!knownPositions.includes(posId)) {
          const val = pyramid[levelIndex][i];
          const userVal = parseInt(userInputs[posId]);
          if (userVal !== val) allCorrect = false;
        }
      }
    }
    setIsCorrect(allCorrect);
  };

  const handleClear = () => {
    setUserInputs({});
    setCheckAnswers(false);
    setIsCorrect(null);
    setShowSolution(false);
  };

  const renderLevel = (level, levelIndex) => (
    <div key={levelIndex} className="level">
      {level.map((val, i) => {
        const label = `${levelIndex}-${i}`;
        let isKnown = false;
        let posId = '';

        if (order === 3) {
          const map3 = [['c'], ['a', 'b'], ['x', 'y', 'z']];
          posId = map3[levelIndex][i];
          isKnown = knownPositions.includes(posId);
        } else {
          const map4 = [['c'], ['b1', 'b2'], ['a1', 'a2', 'a3'], ['x1', 'x2', 'x3', 'x4']];
          posId = map4[levelIndex][i];
          isKnown = knownPositions.includes(posId);
        }

        const userVal = userInputs[posId];
        const correct = parseInt(userVal) === val;
        let cls = "cell";

        if (isKnown) cls += " known";
        else if (checkAnswers && userVal !== undefined && userVal !== "") cls += correct ? " ok" : " bad";

        return (
          <div key={label} className={cls}>
            {(isKnown || showSolution)
              ? val
              : <input
                  type="text"
                  value={userInputs[posId] || ""}
                  onChange={(e) => handleInputChange(posId, e.target.value)}
                  disabled={checkAnswers}
                />}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="card">
      <h2 className="h2">Generador de Pirámides Aditivas</h2>

      <div className="grid">
        <div>
          <label className="label">Orden</label>
          <select value={order} onChange={(e) => setOrder(parseInt(e.target.value))}>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
        <div>
          <label className="label">Rango</label>
          <select value={range} onChange={(e) => setRange(parseInt(e.target.value))}>
            <option value={10}>0–10</option>
            <option value={50}>0–50</option>
            <option value={100}>0–100</option>
          </select>
        </div>
        <div>
          <label className="label">Negativos</label>
          <select value={allowNeg ? "true" : "false"} onChange={(e) => setAllowNeg(e.target.value === "true")}>
            <option value="false">No</option>
            <option value="true">Sí</option>
          </select>
        </div>
        <div>
          <label className="label">Modo</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="random">Aleatorio (sol. única)</option>
            <option value="base">Números de la base</option>
          </select>
        </div>
      </div>

      <div className="row">
        <button className="btn" onClick={generate}>Generar Pirámide</button>
        {pyramid.length > 0 && (
          <>
            <button className="btn secondary" onClick={() => setShowSolution(s => !s)}>
              {showSolution ? 'Ocultar Solución' : 'Mostrar Solución'}
            </button>
            <button className="btn ghost" onClick={handleCheckAnswers}>Comprobar Solución</button>
          </>
        )}
      </div>

      {pyramid.length > 0 && (
        <div className="center">
          {pyramid.map((level, idx) => renderLevel(level, idx))}
          {isCorrect && checkAnswers && (
            <p style={{color:"#166534", fontWeight:700}}>¡Correcto! 🎉</p>
          )}
          <button className="btn destructive" onClick={handleClear}>Limpiar</button>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PyramidGenerator />);
