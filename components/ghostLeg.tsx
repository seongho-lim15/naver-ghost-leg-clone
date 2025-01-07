"use client";

import { FC, useEffect, useRef, useState } from "react";
import { UserInput } from "@/components/userInput";
import { AnimalButtons } from "@/components/AnimalButton";

export const GhostLeg: FC = () => {
  const [userNum, setUserNum] = useState<number>(2);
  const [containerPixel, setContainerPixel] = useState<number>(100);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    // 시작 초기화
    setIsStart(false);

    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        const animalIcon = await loadImage("/images/animals.png");
        const numberIcons = await loadImage("/images/numbers.png");

        // 고해상도를 위해 캔버스 크기 조정
        const dpr = window.devicePixelRatio || 1; // 디바이스 픽셀 비율 확인
        // 캔버스의 실제 해상도를 높이기
        canvas.width = 600 * dpr;
        canvas.height = 308 * dpr;

        // 공통 변수 설정
        const cropX = 0;
        const cropY = 0;
        const cropWidth = 85 * userNum;
        const cropHeight = 84;

        // const canvasRatio = (canvas.width / canvas.height) * 0.5;
        // const destWidth = (90 * userNum) / canvasRatio;
        // const destHeight = 84 / canvasRatio;

        const destWidth = 95 * userNum;
        const destHeight = 84;

        // 동물 아이콘 그리기
        ctx.drawImage(
          animalIcon,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          destWidth,
          destHeight
        );

        // 숫자 아이콘 그리기
        ctx.drawImage(
          numberIcons,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          canvas.height - 80,
          destWidth,
          destHeight
        );
      };

      drawImages();
    }
  }, [userNum]);

  /**
   * 사다리 게임 시작. 사다리 그리기
   */
  useEffect(() => {
    if (isStart) {
      const canvas = canvasRef.current;

      if (canvas) {
        const ctx = canvas.getContext("2d")!;

        /**
         * 랜덤으로 사다리 배열 만들기
         */
        const makeRandomGhostLeg = () => {
          const ghostLegArr: number[][] = [];
          const firstAndLastEl = new Array(userNum - 1).fill(0);

          ghostLegArr.push(firstAndLastEl);
          ghostLegArr.push(firstAndLastEl);

          // 각 배열 요소에 어디에 1 이 들어갈껀지 세팅, 총 5개 행
          new Array(5).fill(0).map(() => {
            const arr = Array(userNum - 1).fill(0); // (유저수 - 1) 의 길이를 가진 배열 생성 예) [0, 0, 0, 0, 0]
            const positions = Array(userNum - 1) // 인덱스 리스트
              .fill(0)
              .map((_, idx) => {
                return idx;
              });

            const ceil = Math.ceil((userNum - 1) / 2);
            let count = 0; // 1의 개수
            const limitCnt = Math.ceil(Math.random() * ceil); // 최대 1의 갯수

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
                  // 필요한 1의 개수
                  break;
                }
              }
            }

            ghostLegArr.splice(1, 0, arr);
          });

          return ghostLegArr;
        };

        /**
         * 사다리 배열에 맞춰 사다리 그리기
         * @param userIdx
         */
        const drawLine = async (userIdx: number, ghostLegArray: number[][]) => {
          // 선 스타일 설정
          ctx.strokeStyle = "lightgrey"; // 선 색상
          ctx.lineWidth = 12; // 선 두께

          /* 수직선 그리기 */
          const startX = 45 + userIdx * 95;
          ctx.beginPath(); // 경로 시작
          ctx.moveTo(startX, 100); // 시작점 좌표 (x, y)
          ctx.lineTo(startX, 530); // 끝점 좌표 (x, y)
          ctx.stroke(); // 선 그리기
          ctx.closePath(); // 경로 닫기

          /* 사다리 수평선 그리기 */
          ghostLegArray.map((position, ghostLegIdx) => {
            // 현재 user Index 에서 이어져 있는 수평선이 있을 경우
            if (position[userIdx] == 1) {
              ctx.beginPath(); // 경로 시작
              ctx.moveTo(startX, 100 + ghostLegIdx * 70); // 시작점 좌표 (x, y)
              ctx.lineTo(startX + 95, 100 + ghostLegIdx * 70); // 끝점 좌표 (x, y)
              ctx.stroke(); // 선 그리기
              ctx.closePath(); // 경로 닫기
            }
          });
        };

        const ghostLegArray = makeRandomGhostLeg(); // 랜덤 사다리 배열 만들기
        new Array(userNum)
          .fill(1)
          .map((_, userIdx) => drawLine(userIdx, ghostLegArray)); // 사다리 그리기
      }
    }
  }, [isStart]);

  const increaseUser = () => {
    setUserNum((prevState) => (prevState >= 12 ? prevState : prevState + 1));
    if (userNum < 12) {
      setContainerPixel((prevState) => prevState + 50);
    }
  };

  const decreaseUser = () => {
    setUserNum((prevState) => (prevState <= 2 ? prevState : prevState - 1));

    if (userNum > 2) {
      setContainerPixel((prevState) => prevState - 50);
    }
  };

  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

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
                        display: isStart ? "none" : "inline",
                      }}
                    >
                      <p>각자 동물을 선택하고 사다리를 타보세요.</p>{" "}
                      <a
                        href="#"
                        className="game_start"
                        style={{ display: "inline" }}
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
                            <AnimalButtons userNum={userNum} />
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
                      style={{ display: "none" }}
                    ></div>
                    <div className="cntrol_btn" style={{ display: "none" }}>
                      <button type="button" className="relt">
                        결과보기
                      </button>
                      <button type="button" className="again">
                        다시하기
                      </button>
                    </div>
                  </div>
                  <div className="cntrl_frm">
                    <h4>내기설정</h4>
                    <UserInput userNum={userNum} />

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
