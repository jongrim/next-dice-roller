import * as React from 'react';

type diceNeedsSubmission = {
  d6: number;
  d8: number;
  d10: number;
  d12: number;
  d20: number;
  d100: number;
};

interface DiceSelectionFormProps {
  onSubmit: (needs: diceNeedsSubmission) => void;
}

const DiceSelectionForm: React.FC<DiceSelectionFormProps> = ({ onSubmit }) => {
  const [d6, setD6] = React.useState('');
  const [d8, setD8] = React.useState('');
  const [d10, setD10] = React.useState('');
  const [d12, setD12] = React.useState('');
  const [d20, setD20] = React.useState('');
  const [d100, setD100] = React.useState('');
  return (
    <form>
      <label htmlFor="d6">Number of d6</label>
      <input
        type="number"
        name="d6"
        id="d6"
        min="1"
        max="20"
        onChange={(e) => setD6(e.target.value)}
        value={d6}
      />
      <label htmlFor="d8">Number of d8</label>
      <input
        type="number"
        name="d8"
        id="d8"
        min="1"
        max="20"
        onChange={(e) => setD8(e.target.value)}
        value={d8}
      />
      <label htmlFor="d10">Number of d10</label>
      <input
        type="number"
        name="d10"
        id="d10"
        min="1"
        max="20"
        onChange={(e) => setD10(e.target.value)}
        value={d10}
      />
      <label htmlFor="d12">Number of d12</label>
      <input
        type="number"
        name="d12"
        id="d12"
        min="1"
        max="20"
        onChange={(e) => setD12(e.target.value)}
        value={d12}
      />
      <label htmlFor="d20">Number of d20</label>
      <input
        type="number"
        name="d20"
        id="d20"
        min="1"
        max="20"
        onChange={(e) => setD20(e.target.value)}
        value={d20}
      />
      <label htmlFor="d100">Number of d100</label>
      <input
        type="number"
        name="d100"
        id="d100"
        min="1"
        max="20"
        onChange={(e) => setD100(e.target.value)}
        value={d100}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          onSubmit({
            d6: d6 ? Number.parseInt(d6, 10) : 0,
            d8: d8 ? Number.parseInt(d8, 10) : 0,
            d10: d10 ? Number.parseInt(d10, 10) : 0,
            d12: d12 ? Number.parseInt(d12, 10) : 0,
            d20: d20 ? Number.parseInt(d20, 10) : 0,
            d100: d100 ? Number.parseInt(d100, 10) : 0,
          });
        }}>
        Roll dice
      </button>
      <style jsx>{`
        form {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
        }
      `}</style>
    </form>
  );
};

export default DiceSelectionForm;
