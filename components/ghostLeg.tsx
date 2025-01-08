"use client";

import { FC, useEffect, useRef, useState } from "react";
import { UserInput } from "@/components/userInput";
import { AnimalButtons } from "@/components/AnimalButton";

export const GhostLeg: FC = () => {
  const [domLoaded, setDomLoaded] = useState(false);
  const [userNum, setUserNum] = useState<number>(2);
  const [containerPixel, setContainerPixel] = useState<number>(100);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null); // 백그라운드 캔버스
  const fgCanvasRef = useRef<HTMLCanvasElement | null>(null); // 사다리 타기 라인 캔버스
  const [isStart, setIsStart] = useState(false);
  const [nagi, setNagi] = useState<{ [key: number]: string }>({});
  const [ghostLeg, setGhostLeg] = useState<number[][]>([]);
  const [defaultCanvas, setDefaultCanvas] = useState<HTMLCanvasElement | null>(
    null
  );

  const [targetAnimal, setTargetAnimal] = useState<number | null>(null);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  /**
   * 인원 수 변경
   */
  useEffect(() => {
    // 내기 설정
    for (let i = 0; i < userNum; i++) {
      if (!nagi[i]) {
        nagi[i] = "";
      }
    }

    setTargetAnimal(null); // 타겟 초기화
    setIsStart(false); // 시작 초기화
    setDefaultCanvas(null); // 기본 캔버스 초기화

    drawAnimalImg(); // 동물 이미지 그리기
  }, [userNum]);

  /**
   * 사다리 게임 시작. 사다리 그리기
   */
  useEffect(() => {
    if (isStart) {
      drawGhostLegLine();
    }
  }, [isStart]);

  /**
   * 동물, 번호 이미지 그리기
   */
  const drawAnimalImg = (cb: (() => void) | null = null) => {
    const bgCanvas = bgCanvasRef.current;
    const fgCanvas = fgCanvasRef.current;

    if (bgCanvas && fgCanvas) {
      const bgCtx = bgCanvas.getContext("2d")!;
      const fgCtx = fgCanvas.getContext("2d")!;

      const bgOffCanvas = document.createElement("canvas"); // 백그라운드 오프스크린 캔버스 생성
      bgOffCanvas.width = bgCanvas.width;
      bgOffCanvas.height = bgCanvas.height;
      const bgOffCtx = bgOffCanvas.getContext("2d");

      const fgOffCanvas = document.createElement("canvas"); // 포그라운드 오프스크린 캔버스 생성
      fgOffCanvas.width = fgCanvas.width;
      fgOffCanvas.height = fgCanvas.height;
      const fgOffCtx = fgOffCanvas.getContext("2d");

      if (bgOffCtx && fgOffCtx) {
        bgOffCtx.clearRect(0, 0, bgOffCanvas.width, bgOffCanvas.height); // 백그라운드 오프스크린 캔버스 초기화
        fgOffCtx.clearRect(0, 0, bgOffCanvas.width, bgOffCanvas.height); // 포그라운드 오프스크린 캔버스 초기화

        /**
         * 이미지 로드
         * @param src
         */
        const loadImage = (src: string) => {
          return new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
          });
        };

        /**
         * 이미지 로드 완료된 후, 캔버스에 이미지 그리기
         */
        const drawImages = async () => {
          const animalAndNumberIcons = await loadImage(
            "/images/sprite_junis_small_v4.png"
          );

          // 고해상도를 위해 캔버스 크기 조정
          // const dpr = window.devicePixelRatio || 1; // 디바이스 픽셀 비율 확인

          // 캔버스의 실제 해상도를 높이기
          bgCanvas.width = 600;
          bgCanvas.height = 308;
          fgCanvas.width = 600;
          fgCanvas.height = 308;

          const cropX = 0; // 이미지 크롭 시작 x 좌표
          const cropY = 0; // 이미지 크롭 시작 y 좌표
          const cropWidth = 50 * userNum; // 이미지 크롭 너비
          const cropHeight = 50; // 이미지 크롭 높이
          const canvasX = 0; // 이미지를 그릴 canvas 의 x 좌표
          const canvasY = 0; // 이미지를 그릴 canvas 의 y 좌표
          const destWidth = 50 * userNum;
          const destHeight = 50;

          // 백그라운드에 동물 아이콘 그림자 그리기
          bgOffCtx.drawImage(
            animalAndNumberIcons,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            canvasX,
            canvasY,
            destWidth,
            destHeight
          );

          // 백그라운드에 숫자 아이콘 그리기
          bgOffCtx.drawImage(
            animalAndNumberIcons,
            cropX,
            cropY + 100,
            cropWidth,
            cropHeight,
            0,
            bgCanvas.height - 50,
            destWidth,
            destHeight
          );

          // 포그라운드에 동물 아이콘 그리기
          fgOffCtx.drawImage(
            animalAndNumberIcons,
            cropX,
            cropY + 50,
            cropWidth,
            cropHeight,
            canvasX,
            canvasY,
            destWidth,
            destHeight
          );

          // 백그라운드 캔버스 초기화 후, 백그라운드 오프캔버스를 옮겨 그림
          bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
          bgCtx.drawImage(bgOffCanvas, 0, 0);

          // 포그라운드 캔버스 초기화 후, 포그라운드 오프캔버스를 옮겨 그림
          fgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
          fgCtx.drawImage(fgOffCanvas, 0, 0);

          if (cb) cb(); // 콜백 함수 존재 시 호출
        };

        drawImages();
      }
    }
  };

  /**
   * 사다리 타기 선 그리기
   */
  const drawGhostLegLine = () => {
    const canvas = fgCanvasRef.current;

    if (canvas) {
      const ghostLegArray = makeRandomGhostLeg(); // 랜덤 사다리 배열 만들기
      setGhostLeg(ghostLegArray); // 사다리 상태 저장

      // 사다리 그리기
      new Array(userNum)
        .fill(1)
        .map((_, userIdx) => drawLine(userIdx, ghostLegArray));
    }
  };

  /**
   * 랜덤으로 사다리 배열 만들기
   */
  const makeRandomGhostLeg = () => {
    const ghostLegArr: number[][] = [];
    const firstAndLastEl = Array.from({ length: userNum }, () => 0); // 사다리의 배열의 처음과 마지막 행

    ghostLegArr.push(firstAndLastEl);
    ghostLegArr.push(firstAndLastEl);

    // 배열 요소 어디에 1 이 들어갈껀지 세팅, 총 7개 행
    Array.from({ length: 7 }).forEach(() => {
      let count = 0; // 1의 개수

      const maxCntByUserNum = [0, 2, 2, 2, 4, 4, 4, 6, 6, 6, 8, 8];
      const limitCnt = maxCntByUserNum[userNum - 1]; // 최대 1의 갯수

      const arr = Array.from({ length: userNum }, () => 0); // 유저수 길이를 가진 배열 생성. 예) userNum == 5, arr == [0, 0, 0, 0, 0]
      const positions = Array.from({ length: userNum - 1 }, (_, i) => i); // 인덱스 리스트 생성. 예) positions = [0, 1, 2, 3]

      // 인덱스를 무작위로 섞음
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 0 <= x < 5, j 는 0,1,2,3,4 사이의 정수값
        [positions[i], positions[j]] = [positions[j], positions[i]];
        // 위 코드를 실행하면 i=4, j=2 라고 했을 때, position[4] = position[2] 가 되고, position[2] = position[4] 가 된다.
        // 이렇게 무작위로 섞인 인덱스 배열이 생성됨
      }

      // positions = [1,2,3,0] 라고 가정, index = 4 가 없는 이유는 마지막일 때는 1을 2개를 못 넣으니깐
      // arr = [0, 0, 0, 0, 0], userNum = 5
      for (const posIdx of positions) {
        // 현재 위치가 0 일때
        if (
          posIdx == 0 &&
          arr[posIdx] == 0 &&
          arr[posIdx + 1] == 0 &&
          arr[posIdx + 2] == 0
        ) {
          arr[posIdx] = 1;
          arr[posIdx + 1] = 1;
          count++;
          count++;
        }
        // 현재 위치가 userNum - 2 일때,
        else if (
          posIdx == userNum - 2 &&
          arr[posIdx] == 0 &&
          arr[posIdx + 1] == 0 &&
          arr[posIdx - 1] == 0
        ) {
          arr[posIdx] = 1;
          arr[posIdx + 1] = 1;
          count++;
          count++;
        }
        // 현재 위치 값이 0 이고, 그 다음 위치 값이 0 이고, 그 전과 그 다다음의 위치 값이 0일 경우
        else if (
          arr[posIdx] == 0 &&
          arr[posIdx + 1] == 0 &&
          arr[posIdx + 2] == 0 &&
          arr[posIdx - 1] == 0
        ) {
          arr[posIdx] = 1;
          arr[posIdx + 1] = 1;
          count++;
          count++;
        }

        // 1의 개수를 제한
        if (count >= limitCnt) {
          break;
        }
      }

      ghostLegArr.splice(1, 0, arr);
    });

    return ghostLegArr;
  };

  /**
   * 사다리 배열에 맞춰 사다리 선 그리기
   * @param userIdx
   */
  const drawLine = async (userIdx: number, ghostLegArray: number[][]) => {
    const bgCanvas = bgCanvasRef.current;

    if (bgCanvas) {
      const bgCtx = bgCanvas.getContext("2d")!;
      // 선 스타일 설정
      bgCtx.strokeStyle = "lightgrey"; // 선 색상
      bgCtx.lineWidth = 5; // 선 두께

      const startX = 25 + userIdx * 50; // 사다리 시작 x 좌표
      const defaultStartY = 40; // 기본 사다리 시작 y 좌표
      const lineGap = 28; // 수평 사다리 사이 높이

      /* 수직선 그리기 */
      bgCtx.beginPath(); // 경로 시작
      bgCtx.moveTo(startX, 50); // 시작점 좌표 (x, y)
      bgCtx.lineTo(startX, 260); // 끝점 좌표 (x, y)
      bgCtx.stroke(); // 선 그리기
      bgCtx.closePath(); // 경로 닫기

      /* 사다리 수평선 그리기 */
      ghostLegArray.map((position, ghostLegIdx) => {
        // 현재 user Index 에서 이어져 있는 수평선이 있을 경우
        if (position[userIdx] == 1 && position[userIdx + 1] == 1) {
          bgCtx.beginPath(); // 경로 시작
          bgCtx.moveTo(startX, defaultStartY + ghostLegIdx * lineGap); // 시작점 좌표 (x, y)
          bgCtx.lineTo(startX + 50, defaultStartY + ghostLegIdx * lineGap); // 끝점 좌표 (x, y)
          bgCtx.stroke(); // 선 그리기
          bgCtx.closePath(); // 경로 닫기
        }
      });
    }
  };

  /**
   * 동물 클릭해 사다리 타기 시작
   * @param initialAnimalY
   * @param initialAnimalX
   */
  const clickAnimal = (initialAnimalY: number, initialAnimalX: number) => {
    /**
     * 재귀를 통해 이동
     * @param animalY
     * @param animalX
     */
    const move = async (animalY: number, animalX: number) => {
      let newAnimalX = animalX;
      let newAnimalY = animalY;

      // 현재 좌표의 값이 0 인 경우, 아래로 한칸 이동
      if (ghostLeg[animalY][animalX] === 0) {
        newAnimalY++;
      }
      // 현재 좌표의 값이 1이고
      else if (ghostLeg[animalY][animalX] === 1) {
        // 다음 x 좌표값이 1인경우, 오른쪽으로 한칸 이동 후, 아래로 한칸 이동
        if (ghostLeg[animalY][animalX + 1] === 1) {
          newAnimalX++;
          newAnimalY++;
        }
        // 이전 x 좌표값이 1인경우, 왼쪽으로 한칸 이동 후, 아래로 한칸 이동
        else if (ghostLeg[animalY][animalX - 1] === 1) {
          newAnimalX--;
          newAnimalY++;
        }
      }

      // 기존 좌표에서 이동할 좌표로 사다리를 타고 이동하는 동물 그리기
      await drawMovingAnimalLine(animalY, animalX, newAnimalY, newAnimalX);

      // 마지막 행일 때까지 재귀호출
      if (newAnimalY !== 8) {
        await move(newAnimalY, newAnimalX);
      }
    };

    // 오프스크린 캔버스 생성
    const bgCanvas = bgCanvasRef.current;
    const fgCanvas = fgCanvasRef.current;

    if (bgCanvas && fgCanvas) {
      const bgCtx = bgCanvas.getContext("2d")!;
      const fgCtx = fgCanvas.getContext("2d")!;

      // 오프 캔버스 생성
      const offCanvas = document.createElement("canvas");
      offCanvas.width = bgCanvas.width;
      offCanvas.height = bgCanvas.height;
      const offCtx = offCanvas.getContext("2d");

      // 기존 캔버스가 존재할 시
      if (defaultCanvas) {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height); // 캔버스를 완전히 초기화
        bgCtx.drawImage(defaultCanvas, 0, 0);
      }

      // 기존 캔버스 세팅
      if (offCtx) {
        // 오프 캔버스에 현재 캔버스 저장
        offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height); // 오프스크린 캔버스 초기화
        offCtx.drawImage(bgCanvas, 0, 0);
        setDefaultCanvas(offCanvas);
      }

      move(initialAnimalY, initialAnimalX);
    }
  };

  /**
   * 다시하기 버튼 클릭 시, 사다리 다시 그림
   */
  const reDrawGhostReg = () => {
    setDefaultCanvas(null); // 캔버스 초기화
    setTargetAnimal(null); // 타겟 초기화

    drawAnimalImg(drawGhostLegLine);
  };

  /**
   * 시작점 animalX, animalY 로 시작해서 사다리 타기 라인 그리기
   */
  const drawMovingAnimalLine = async (
    animalY: number,
    animalX: number,
    newAnimalY: number,
    newAnimalX: number
  ) => {
    if (isStart) {
      const canvas = bgCanvasRef.current;

      if (canvas) {
        const ctx = canvas.getContext("2d")!;
        // 선 스타일 설정
        ctx.strokeStyle = "yellow"; // 선 색상
        ctx.lineWidth = 5; // 선 두께

        const defaultStartY = 40; // 기본 사다리 시작 y 좌표

        const startX = 25 + animalX * 50; // 시작 X 좌표
        let startY = defaultStartY + 28 * animalY; // 시작 Y 좌표

        // 시작점일 경우
        if (animalY === 0) {
          startY = startY + 10;
        }

        let currentX = startX; // 현재 X 좌표 (애니메이션 진행 상태)
        let currentY = startY; // 현재 Y 좌표 (애니메이션 진행 상태)

        const endX = 25 + newAnimalX * 50; // 끝 X 좌표
        const endY = defaultStartY + 28 * newAnimalY + 3; // 끝 Y 좌표

        const drawLineX = () => {
          return new Promise((resolve) => {
            const speed = 10; // 속도를 조정하려면 이 값을 변경

            const animate = () => {
              ctx.beginPath(); // 경로 시작
              ctx.moveTo(startX, startY); // 시작점 좌표 (x, y)
              ctx.lineTo(currentX, startY); // 끝점 좌표 (x, y) 횡이동

              ctx.stroke(); // 선 그리기
              ctx.closePath(); // 경로 닫기

              if (currentX !== endX) {
                if (currentX < endX) {
                  currentX += Math.min(speed, endX - currentX); // 오른쪽으로 확장
                } else {
                  currentX -= Math.min(speed, currentX - endX); // 왼쪽으로 축소
                }
                requestAnimationFrame(animate); // 다음 프레임 요청
              } else {
                resolve(true); // 횡 이동 완료 시 Promise 해결
              }
            };
            animate();
          });
        };

        const drawLineY = () => {
          return new Promise((resolve) => {
            const speed = 5; // 속도를 조정하려면 이 값을 변경

            const animate = () => {
              ctx.beginPath(); // 경로 시작
              ctx.moveTo(endX, startY - 3); // 시작점 좌표 (x, y)
              ctx.lineTo(endX, currentY); // 끝점 좌표 (x, y) 종이동

              ctx.stroke(); // 선 그리기
              ctx.closePath(); // 경로 닫기

              if (currentY !== endY) {
                if (currentY < endY) {
                  currentY += Math.min(speed, endY - currentY); // 아래로 확장
                } else {
                  currentY -= Math.min(speed, currentY - endY); // 위로 축소
                }
                requestAnimationFrame(animate); // 다음 프레임 요청
              } else {
                resolve(true); // 종 이동 완료 시 Promise 해결
              }
            };
            animate();
          });
        };

        await drawLineX();
        await drawLineY();
      }
    }
  };

  /**
   * 타겟 세팅
   * @param animalX
   */
  const handleTarget = (animalX: number) => {
    setTargetAnimal((prevState) => (prevState ? null : animalX));
  };

  /**
   * 유저수 증가
   */
  const increaseUser = () => {
    setUserNum((prevState) => (prevState >= 12 ? prevState : prevState + 1));
    if (userNum < 12) {
      setContainerPixel((prevState) => prevState + 50);
    }
  };

  /**
   * 유저수 감소
   */
  const decreaseUser = () => {
    setUserNum((prevState) => (prevState <= 2 ? prevState : prevState - 1));

    if (userNum > 2) {
      setContainerPixel((prevState) => prevState - 50);
    }
  };

  return (
    <div>
      {domLoaded && (
        <div>
          <link
            rel="stylesheet"
            type="text/css"
            href="https://ssl.pstatic.net/sstatic/keypage/outside/scui/mobilegame/css/mcs_mgame_230922.css"
          />

          <section id="portal" className="sc cs_mgame" data-dss-logarea="xmg">
            <div className="api_subject_bx">
              <div className="api_title_area">
                <h2 className="api_title">사다리게임</h2>
              </div>
              <div className="csu_hh">
                <div className="gm_wrp">
                  <div className="cntrl_area">
                    <h3 className="hc">참여 인원수</h3>
                    <span className="prsn_num">
                      <span className="people_num">인원수</span>
                      <em>
                        <span>{userNum}</span>명
                      </em>{" "}
                      <button
                        type="button"
                        className="mns"
                        onClick={() => {
                          decreaseUser();
                        }}
                      >
                        빼기
                      </button>{" "}
                      <button
                        type="button"
                        className="pls"
                        onClick={() => {
                          increaseUser();
                        }}
                      >
                        더하기
                      </button>{" "}
                    </span>{" "}
                    <p className="ifm">(최소2명~최대12명)</p>
                  </div>
                  <div
                    className="canvas_area"
                    style={{ backgroundSize: "auto", textAlign: "center" }}
                  >
                    <h4 className="hc">사다리 영역</h4>
                    <div
                      className="situation"
                      style={{
                        display: "inline",
                      }}
                    >
                      {isStart ? (
                        <p>동물을 클릭하여 결과를 확인하세요.</p>
                      ) : (
                        <p>각자 동물을 선택하고 사다리를 타보세요.</p>
                      )}{" "}
                      <a
                        href="#"
                        className="game_start"
                        style={{ display: isStart ? "none" : "inline" }}
                        onClick={() => setIsStart(true)}
                      >
                        사다리 타기 시작하기
                      </a>
                    </div>
                    <div
                      className="scrollview _jmc_no_tap_highlight_"
                      style={{
                        height: "308px",
                        marginBottom: "5px",
                        overflow: "hidden",
                        position: "relative",
                        display: "block",
                      }}
                    >
                      <div
                        className="scroller"
                        style={{
                          position: "absolute",
                          zIndex: 1,
                          left: "0px",
                          top: "0px",
                          // transitionProperty, -webkit-transform; transform: translate(0px, 0px),
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <div
                          className="_canvasContainer"
                          style={{
                            position: "relative",
                            margin: "0px auto",
                            left: "0px",
                            width: `${containerPixel}px`,
                            height: "308px",
                          }}
                        >
                          <canvas
                            className="_bgCanvasPane"
                            ref={bgCanvasRef}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              zIndex: 100,
                              width: "600px",
                              height: "308px",
                            }}
                          ></canvas>
                          <canvas
                            className="_fgCanvasPane"
                            ref={fgCanvasRef}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              zIndex: 110,
                              width: "600px",
                              height: "308px",
                            }}
                          ></canvas>
                          <div
                            className="_eventPane"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              background: "#fff",
                              opacity: 0,
                              zIndex: 120,
                            }}
                          >
                            <AnimalButtons
                              userNum={userNum}
                              moveAnimal={(
                                animalY: number,
                                animalX: number
                              ) => {
                                if (isStart) {
                                  clickAnimal(animalY, animalX);
                                } else {
                                  handleTarget(animalX);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="paginate">
                        <a
                          href={"#"}
                          className="pre"
                          style={{ display: "none" }}
                        >
                          이전화전
                        </a>{" "}
                        <a
                          href="#"
                          className="next"
                          style={{ display: "none" }}
                        >
                          다음화면
                        </a>
                      </div>
                    </div>
                    <div
                      className="result_area"
                      style={{ display: isStart ? "inline" : "none" }}
                    ></div>
                    <div
                      className="cntrol_btn"
                      style={{ display: isStart ? "inline" : "none" }}
                    >
                      <button type="button" className="relt">
                        결과보기
                      </button>
                      <button
                        type="button"
                        className="again"
                        onClick={() => {
                          reDrawGhostReg();
                        }}
                      >
                        다시하기
                      </button>
                    </div>
                  </div>
                  <div className="cntrl_frm">
                    <h4>내기설정</h4>
                    <UserInput
                      userNum={userNum}
                      nagi={nagi}
                      setNagi={setNagi}
                    />
                  </div>
                </div>
                <div className="spe_slc">
                  <span className="other_info">다른 게임</span>
                  <div className="slc_w">
                    <select className="slc">
                      <option value="">선택하세요</option>
                      <option>가위바위보 게임</option>
                      <option>당첨자 추첨</option>
                      <option>원판돌리기</option>
                      <option>주사위 굴리기</option>
                      <option>제비뽑기</option>
                      <option>화살표돌리기</option>
                      <option>간단게임모음</option>
                    </select>
                  </div>
                </div>
                <script type="text/template" className="_tmplLadderEventPane">
                  <a
                    href="#"
                    className="_avatar"
                    data-idx="{=nIndex}"
                    style={{ display: "inline-block" }}
                  ></a>
                </script>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
