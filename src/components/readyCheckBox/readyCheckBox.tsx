import React from 'react';

type Props = {
  isReady: boolean;
  handleIsReady: (isReady: boolean) => void;
};

const ReadyCheckbox: React.FC<Props> = ({ isReady, handleIsReady }) => {
  const handleCheckboxChange = () => {
    handleIsReady(!isReady);
  };

  return (
    <label>
      <input type="checkbox" checked={isReady} onChange={handleCheckboxChange} />
      Ready
    </label>
  );
};

export default ReadyCheckbox;
