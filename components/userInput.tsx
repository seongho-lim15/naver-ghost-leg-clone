export const UserInput = ({ userNum }: { userNum: number }) => {
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
                value=""
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
