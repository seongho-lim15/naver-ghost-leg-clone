import { FC } from "react";

export const GhostLeg: FC = () => {
  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://ssl.pstatic.net/sstatic/keypage/outside/scui/mobilegame/css/mcs_mgame_230922.css"
      />

      <section className="sc cs_mgame" data-dss-logarea="xmg">
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
                    <span>6</span>명
                  </em>{" "}
                  <button type="button" className="mns">
                    빼기
                  </button>{" "}
                  <button type="button" className="pls">
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
                <div className="situation">
                  <p>각자 동물을 선택하고 사다리를 타보세요.</p>{" "}
                  <a
                    href="#"
                    className="game_start"
                    style={{ display: "inline" }}
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
                        width: "300px",
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
                        }}
                        width="600"
                        height="308"
                      ></canvas>
                      <canvas
                        className="_fgCanvasPane"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          zIndex: 110,
                        }}
                        width="600"
                        height="308"
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
                          // filter: alpha((opacity = 0)),
                          zIndex: 120,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="paginate">
                    <a href={"#"} className="pre" style={{ display: "none" }}>
                      이전화전
                    </a>{" "}
                    <a href="#" className="next" style={{ display: "none" }}>
                      다음화면
                    </a>
                  </div>
                </div>
                <div className="result_area" style={{ display: "none" }}></div>
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
                <div className="btn_area">
                  <button type="button" className="rfsh">
                    초기화
                  </button>
                  <button type="button" className="rndm">
                    추천내기
                    <span>
                      <span className="hc">열기</span>
                    </span>
                  </button>
                </div>
                <div className="recom_area" style={{ display: "none" }}>
                  <div className="rcm_lst">
                    <div className="line">
                      <h5 className="hc">추천내기 리스트</h5>
                      <ul className="rcm">
                        <li>
                          <a href="#">간식내기</a>
                        </li>
                        <li>
                          <a href="#">벌칙자뽑기</a>
                        </li>
                        <li>
                          <a href="#">당첨자뽑기</a>
                        </li>
                        <li>
                          <a href="#">순서정하기</a>
                        </li>
                        <li>
                          <a href="#">편나누기</a>
                        </li>
                        <li>
                          <a href="#">조모임역할</a>
                        </li>
                      </ul>
                      <h5>추천내기</h5>
                      <ul className="rcn_noti">
                        <li>상황별로 내기를 추천해드리는 기능입니다</li>
                        <li>
                          자동으로 입력된 내용이 불필요하다면 초기화 로
                          삭제하시거나 조금씩 수정하여 사용해 보세요.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="ad_lst">
                  <ol>
                    <li>
                      <div>
                        <span className="num">1</span>
                        <input
                          type="text"
                          maxLength={8}
                          value=""
                          title="1번 내기 작성하기"
                          placeholder="입력해주세요"
                          className="_betting"
                        />
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className="num">2</span>
                        <input
                          type="text"
                          maxLength={8}
                          value=""
                          title="2번 내기 작성하기"
                          placeholder="입력해주세요"
                          className="_betting"
                        />
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className="num">3</span>
                        <input
                          type="text"
                          maxLength={8}
                          value=""
                          title="3번 내기 작성하기"
                          placeholder="입력해주세요"
                          className="_betting"
                        />
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className="num">4</span>
                        <input
                          type=" text"
                          maxLength={8}
                          value=""
                          title="4번 내기 작성하기"
                          placeholder="입력해주세요"
                          className="_betting"
                        />
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className="num">5</span>
                        <input
                          type="text"
                          maxLength={8}
                          value=""
                          title="5번 내기 작성하기"
                          placeholder="입력해주세요"
                        />
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className="num">6</span>
                        <input
                          type=" text"
                          maxLength={8}
                          value=""
                          title="6번 내기 작성하기"
                          placeholder="입력해주세요"
                          className="_betting"
                        />
                      </div>
                    </li>
                  </ol>
                </div>
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
            <li>
              <div>
                <input
                  type="text"
                  maxLength={8}
                  value=""
                  title="{=nSeq}번 내기 작성하기"
                  placeholder="입력해주세요"
                  className="_betting"
                />
              </div>
            </li>
          </div>
        </div>
      </section>
    </>
  );
};
