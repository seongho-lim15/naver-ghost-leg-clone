export const AnimalButtons = ({ userNum }: { userNum: number }) => {
  return (
    <>
      {new Array(userNum).fill(1).map((_, idx) => (
        <a
          key={idx}
          href="#"
          className="_avatar"
          data-idx={idx}
          style={{
            display: "inline-block",
            width: "50px",
            height: "50px",
          }}
        />
      ))}
    </>
  );
};
