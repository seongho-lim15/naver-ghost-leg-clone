"use client";

import { FC, useEffect, useRef, useState } from "react";
import { UserInput } from "@/components/userInput";
import { AnimalButtons } from "@/components/AnimalButton";

export const GhostLeg: FC = () => {
  const [domLoaded, setDomLoaded] = useState(false);
  const [userNum, setUserNum] = useState<number>(2);
  const [containerPixel, setContainerPixel] = useState<number>(100);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isStart, setIsStart] = useState(false);
  const [nagi, setNagi] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  /**
   * 인원 수 변경
   */
  useEffect(() => {
    for (let i = 0; i < userNum; i++) {
      if (!nagi[i]) {
        nagi[i] = "";
      }
    }

    console.log("nagi : ", nagi);
    setIsStart(false); // 시작 초기화
    drawAnimalImg(); // 동물 이미지 그리기
  }, [userNum]);

  /**
   * 사다리 게임 시작. 사다리 그리기
   */
  useEffect(() => {
    if (isStart) {
      drawGhostLeg();
    }
  }, [isStart]);

  /**
   * 동물, 번호 이미지 그리기
   */
  const drawAnimalImg = (cb: (() => void) | null = null) => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d")!;

      // 오프스크린 캔버스 생성
      const offCanvas = document.createElement("canvas");
      offCanvas.width = canvas.width;
      offCanvas.height = canvas.height;
      const offCtx = offCanvas.getContext("2d");

      if (offCtx) {
        offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);

        /**
         * 이미지 로드 함수
         * @param src
         */
        const loadImage = (src: string) => {
          return new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
          });
        };

        // 이미지 로드 후 그리기
        const drawImages = async () => {
          const animalAndNumberIcons = await loadImage(
            "/images/sprite_junis_small_v4.png"
          );

          // 고해상도를 위해 캔버스 크기 조정
          const dpr = window.devicePixelRatio || 1; // 디바이스 픽셀 비율 확인

          // 캔버스의 실제 해상도를 높이기
          canvas.width = 600;
          canvas.height = 308;

          const cropX = 0; // 이미지 크롭 시작 x 좌표
          const cropY = 0; // 이미지 크롭 시작 y 좌표
          const cropWidth = 50 * userNum; // 이미지 크롭 너비
          const cropHeight = 50; // 이미지 크롭 높이
          const canvasX = 0; // 이미지를 그릴 canvas 의 x 좌표
          const canvasY = 0; // 이미지를 그릴 canvas 의 y 좌표
          const destWidth = 50 * userNum;
          const destHeight = 50;

          // 동물 아이콘 그림자 그리기
          offCtx.drawImage(
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

          // 동물 아이콘 그리기
          offCtx.drawImage(
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

          // 숫자 아이콘 그리기
          offCtx.drawImage(
            animalAndNumberIcons,
            cropX,
            cropY + 100,
            cropWidth,
            cropHeight,
            0,
            canvas.height - 50,
            destWidth,
            destHeight
          );

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(offCanvas, 0, 0);

          cb && cb(); // 콜백 함수 존재 시 호출
        };

        drawImages();
      }
    }
  };

  /**
   * 사다리 선 그리기
   */
  const drawGhostLeg = () => {
    const canvas = canvasRef.current;

    if (canvas) {
      /**
       * 랜덤으로 사다리 배열 만들기
       */
      const makeRandomGhostLeg = () => {
        const ghostLegArr: number[][] = [];
        const firstAndLastEl = new Array(userNum - 1).fill(0);

        ghostLegArr.push(firstAndLastEl);
        ghostLegArr.push(firstAndLastEl);

        // 각 배열 요소에 어디에 1 이 들어갈껀지 세팅, 총 7개 행
        new Array(7).fill(0).map((_, idx) => {
          const ceil = Math.ceil((userNum - 1) / 2);
          let count = 0; // 1의 개수
          const limitCnt = Math.ceil(Math.random() * ceil); // 최대 1의 갯수

          const arr = Array(userNum - 1).fill(0); // (유저수 - 1) 의 길이를 가진 배열 생성 예) [0, 0, 0, 0, 0]
          const positions = Array(userNum - 1) // 인덱스 리스트
            .fill(0)
            .map((_, idx) => {
              return idx;
            });

          // 인덱스를 무작위로 섞음
          for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
          }

          for (const pos of positions) {
            // 현재 위치와 양쪽 인접 위치를 확인
            if (
              (pos === 0 || arr[pos - 1] === 0) &&
              (pos === userNum - 2 || arr[pos + 1] === 0)
            ) {
              arr[pos] = 1;
              count++;
              // 1의 개수를 제한
              if (count >= limitCnt) {
                break;
              }
            }
          }

          ghostLegArr.splice(1, 0, arr);
        });

        return ghostLegArr;
      };

      const ghostLegArray = makeRandomGhostLeg(); // 랜덤 사다리 배열 만들기
      new Array(userNum)
        .fill(1)
        .map((_, userIdx) => drawLine(userIdx, ghostLegArray)); // 사다리 그리기
    }
  };

  /**
   * 사다리 배열에 맞춰 사다리 선 그리기
   * @param userIdx
   */
  const drawLine = async (userIdx: number, ghostLegArray: number[][]) => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d")!;

      // 선 스타일 설정
      ctx.strokeStyle = "lightgrey"; // 선 색상
      ctx.lineWidth = 5; // 선 두께

      /* 수직선 그리기 */
      const startX = 25 + userIdx * 50;
      ctx.beginPath(); // 경로 시작
      ctx.moveTo(startX, 50); // 시작점 좌표 (x, y)
      ctx.lineTo(startX, 260); // 끝점 좌표 (x, y)
      ctx.stroke(); // 선 그리기
      ctx.closePath(); // 경로 닫기

      /* 사다리 수평선 그리기 */
      const lineGap = 28;
      const startY = 40;

      ghostLegArray.map((position, ghostLegIdx) => {
        // 현재 user Index 에서 이어져 있는 수평선이 있을 경우
        if (position[userIdx] == 1) {
          ctx.beginPath(); // 경로 시작
          ctx.moveTo(startX, startY + ghostLegIdx * lineGap); // 시작점 좌표 (x, y)
          ctx.lineTo(startX + 50, startY + ghostLegIdx * lineGap); // 끝점 좌표 (x, y)
          ctx.stroke(); // 선 그리기
          ctx.closePath(); // 경로 닫기
        }
      });
    }
  };

  /**
   * 동물을 클릭해서 사다리 타기 시작
   */
  const moveAnimal = (animalIdx: number) => {
    if (isStart) {
      const canvas = canvasRef.current;

      if (canvas) {
        const ctx = canvas.getContext("2d")!;

        // 선 스타일 설정
        ctx.strokeStyle = "yellow"; // 선 색상
        ctx.lineWidth = 5; // 선 두께

        const startX = 25 + animalIdx * 50; // 시작 X 좌표
        const startY = 50; // 시작 Y 좌표
        const endY = 260; // 끝 Y 좌표
        let currentY = startY; // 현재 Y 좌표 (애니메이션 진행 상태)

        const drawLine = () => {
          ctx.beginPath(); // 경로 시작
          ctx.moveTo(startX, startY); // 시작점 좌표 (x, y)
          ctx.lineTo(startX, currentY); // 끝점 좌표 (x, y)
          ctx.stroke(); // 선 그리기
          ctx.closePath(); // 경로 닫기

          if (currentY < endY) {
            currentY += 3; // 선을 아래로 확장 (속도 조정 가능)
            requestAnimationFrame(drawLine); // 다음 프레임 요청
          }
        };

        drawLine();
      }
    }
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
                            ref={canvasRef}
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
                              moveAnimal={moveAnimal}
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
                          drawAnimalImg(drawGhostLeg);
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

                    {/*<div className="btn_area">*/}
                    {/*  <button type="button" className="rfsh">*/}
                    {/*    초기화*/}
                    {/*  </button>*/}
                    {/*  <button type="button" className="rndm">*/}
                    {/*    추천내기*/}
                    {/*    <span>*/}
                    {/*      <span className="hc">열기</span>*/}
                    {/*    </span>*/}
                    {/*  </button>*/}
                    {/*</div>*/}
                    {/*<div className="recom_area" style={{ display: "none" }}>*/}
                    {/*  <div className="rcm_lst">*/}
                    {/*    <div className="line">*/}
                    {/*      <h5 className="hc">추천내기 리스트</h5>*/}
                    {/*      <ul className="rcm">*/}
                    {/*        <li>*/}
                    {/*          <a href="#">간식내기</a>*/}
                    {/*        </li>*/}
                    {/*        <li>*/}
                    {/*          <a href="#">벌칙자뽑기</a>*/}
                    {/*        </li>*/}
                    {/*        <li>*/}
                    {/*          <a href="#">당첨자뽑기</a>*/}
                    {/*        </li>*/}
                    {/*        <li>*/}
                    {/*          <a href="#">순서정하기</a>*/}
                    {/*        </li>*/}
                    {/*        <li>*/}
                    {/*          <a href="#">편나누기</a>*/}
                    {/*        </li>*/}
                    {/*        <li>*/}
                    {/*          <a href="#">조모임역할</a>*/}
                    {/*        </li>*/}
                    {/*      </ul>*/}
                    {/*      <h5>추천내기</h5>*/}
                    {/*      <ul className="rcn_noti">*/}
                    {/*        <li>상황별로 내기를 추천해드리는 기능입니다</li>*/}
                    {/*        <li>*/}
                    {/*          자동으로 입력된 내용이 불필요하다면 초기화 로*/}
                    {/*          삭제하시거나 조금씩 수정하여 사용해 보세요.*/}
                    {/*        </li>*/}
                    {/*      </ul>*/}
                    {/*    </div>*/}
                    {/*  </div>*/}
                    {/*</div>*/}
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
