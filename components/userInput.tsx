import React from "react";

export const UserInput = ({
  userNum,
  nagi,
  setNagi,
}: {
  userNum: number;
  nagi: { [key: number]: string };
  setNagi: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
}) => {
  const handleChangeNagi = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const changeNagiText = e.target.value;

    setNagi((prevState) => {
      return { ...prevState, [idx]: changeNagiText };
    });
  };

  return (
    <div className="ad_lst">
      <ol>
        {new Array(userNum).fill(1).map((_, idx) => (
          <li key={idx}>
            <div>
              <span className="num">{idx + 1}</span>
              <input
                type="text"
                maxLength={8}
                value={nagi[idx]}
                onChange={(e) => handleChangeNagi(e, idx)}
                title={`${idx + 1}번 내기 작성하기`}
                placeholder={`${idx + 1}번 내기 작성하기`}
                className="_betting"
              />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
