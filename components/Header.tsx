export const Header = () => {
  return (
    <header>
      <div className="header _header">
        <div id="_sch" className="sch">
          <section className="_section">
            <div className="search_wrap _sch_w">
              <h1 className="logo_naver">
                <a href="https://m.naver.com/" className="logo_link">
                  <i className="spnew2 ico_logo_n">Naver</i>
                </a>{" "}
                <a href="#" className="logo_link prev_link" id="nx_close_ac_kh">
                  <i className="spnew2 ico_logo_prev">이전페이지</i>
                </a>
              </h1>
              <form
                id="nx_search_form"
                name="search"
                role="search"
                method="get"
                action="?"
              >
                <div className="search_input_wrap _sch_inpw">
                  <div className="search_input_box _sch_inpw_in">
                    <div
                      className="search_input_img _sch_thumb"
                      style={{ display: "none" }}
                    ></div>
                    <div className="search_input_inner">
                      <input type="hidden" name="sm" value="mtb_hty.top" />{" "}
                      <input type="hidden" name="where" value="m" />{" "}
                      <input type="hidden" name="ssc" value="tab.m.all" />
                      <input
                        type="hidden"
                        name="oquery"
                        value="사다리타기게임"
                      />{" "}
                      <input
                        type="hidden"
                        name="tqi"
                        value="i1+NfwqVWUZssdDckhCssssstmK-516903"
                      />
                      <input
                        id="nx_query"
                        type="search"
                        name="query"
                        title="검색어를 입력해주세요."
                        value="사다리타기게임"
                        placeholder="검색어를 입력해주세요."
                        maxLength={255}
                        className="search_input"
                        autoCorrect="off"
                        autoCapitalize="off"
                        autoComplete="off"
                      />
                      <button
                        id="nx_input_clear"
                        type="button"
                        className="btn_delete"
                        style={{ display: "block" }}
                      >
                        <i className="spnew2 ico_delete">입력 내용 삭제</i>
                      </button>
                    </div>
                  </div>
                  <div className="search_btn_box">
                    <button
                      type="button"
                      className="btn_voice"
                      data-ios-scheme="naversearchapp"
                      data-ios-query="search?qmenu=voicerecg&amp;version=26"
                      data-ios-install="393499958"
                      data-ios-universal-fullurl="https://naverapp.m.naver.com/?urlScheme=naversearchapp%3A%2F%2Fsearch%3Fqmenu%3Dvoicerecg%26version%3D26"
                      data-android-scheme="naversearchapp"
                      data-android-query="search?qmenu=voicerecg&amp;version=26"
                      data-android-package="com.nhn.android.search"
                    >
                      <i className="spnew2 ico_voice">음성검색</i>
                    </button>
                    <button type="submit" className="btn_search">
                      <i className="spnew2 ico_search">검색</i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>
          <div id="ac-layer-root" className="u_atcp_wrap">
            <div
              id="sb-kh"
              className="u_sggt_wrap2"
              style={{ display: "none" }}
            >
              <div id="sb-kh-wrapper" className="sggt_fixer">
                <div className="sggt_header">
                  <h2 className="tit">
                    <span className="tit_inner">최근 검색어</span>
                  </h2>
                  <div className="option">
                    <span className="opt_del">
                      <a id="sb-kh-clear" href="#">
                        전체삭제
                      </a>
                    </span>
                  </div>
                </div>
                <div className="sggt_container">
                  <ul id="sb-kh-list" className="kwd_lst"></ul>
                  <div
                    id="sb-kh-off"
                    className="kwd_info kwd_off"
                    style={{ display: "none" }}
                  >
                    검색어 저장 기능이 꺼져 있습니다. <br />
                    <span className="kwd_dsc">
                      설정이 초기화 된다면{" "}
                      <a
                        href="https://help.naver.com/alias/search/word/word_49.naver"
                        className="kwd_help"
                      >
                        도움말
                      </a>
                      을 확인해 주세요.
                    </span>
                  </div>
                  <div
                    id="sb-kh-nothing"
                    className="kwd_info kwd_none"
                    style={{ display: "none" }}
                  >
                    최근 검색어 내역이 없습니다. <br />
                    <span className="kwd_dsc">
                      설정이 초기화 된다면{" "}
                      <a
                        href="https://help.naver.com/alias/search/word/word_49.naver"
                        className="kwd_help"
                      >
                        도움말
                      </a>
                      을 확인해 주세요.
                    </span>
                  </div>
                </div>
                <div id="sb-kh-footer" className="sggt_footer">
                  <span className="side_opt_area">
                    <span className="opt_option">
                      <a id="sb-kh-unuse" href="#">
                        자동저장 끄기
                      </a>
                    </span>
                    <span className="opt_help">
                      <a href="https://help.naver.com/alias/search/word/word_49.naver">
                        도움말
                      </a>
                    </span>
                  </span>
                  <span className="rside_opt_area">
                    <span className="opt_close">
                      <a id="sb-kh-close" href="#">
                        닫기
                      </a>
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div id="sb-ac" className="u_atcp_area" style={{ display: "none" }}>
              <div
                id="sb-ac-answer-wrap"
                className="atcp_crt_w"
                style={{ display: "none" }}
              ></div>
              <ul
                id="sb-ac-recomm-wrap"
                title="자동완성"
                className="u_atcp u_atcp_at"
                style={{ display: "none" }}
              ></ul>
              <div
                id="sb-ac-alert"
                className="u_atcp_alert"
                style={{ display: "none" }}
              ></div>
              <div id="sb-ac-context" className="u_atcp_plus">
                <div className="switch">
                  <input
                    type="checkbox"
                    id="sb-ac-context-label"
                    aria-label="컨텍스트 자동완성"
                  />
                  <label htmlFor="sb-ac-context-label" aria-hidden="true">
                    <span></span>
                  </label>
                </div>
                <div
                  id="sb-ac-context-layer"
                  className="layer_plus"
                  style={{ display: "none" }}
                >
                  <strong className="tit">컨텍스트 자동완성</strong>
                  <p className="dsc _off_dsc">
                    <em className="txt">동일한 시간대・연령대・남녀별</em>{" "}
                    사용자 그룹의 관심사에 <br />
                    맞춰 자동완성을 제공합니다.{" "}
                    <a
                      href="https://help.naver.com/alias/search/word/word_16.naver"
                      className="link"
                    >
                      자세히 보기
                    </a>
                  </p>
                  <div className="_on_dsc" style={{ display: "none" }}>
                    <p className="dsc">
                      ON/OFF설정은 해당기기(브라우저)에 저장됩니다.
                    </p>
                    <div className="btn_area">
                      <a
                        href="https://help.naver.com/alias/search/word/word_16.naver"
                        className="link"
                      >
                        자세히 보기
                      </a>
                    </div>
                  </div>
                  <div className="btn_area">
                    <a
                      href="https://nid.naver.com/nidlogin.login?svctype=262144&amp;url=https%3A%2F%2Fm.search.naver.com%2Fsearch.naver%3Fwhere%3Dm%26sm%3Dtop_sug.pre%26fbm%3D0%26acr%3D1%26acq%3D%25EC%2582%25AC%25EB%258B%25A4%26qdt%3D0%26ie%3Dutf8%26query%3D%25EC%2582%25AC%25EB%258B%25A4%25EB%25A6%25AC%25ED%2583%2580%25EA%25B8%25B0%25EA%25B2%258C%25EC%259E%2584%26ssc%3Dtab.m.all"
                      className="btn btn_login _btn_login"
                    >
                      <i className="imgsvg ico_login"></i>로그인
                    </a>
                  </div>
                  <button type="button" className="btn_close _btn_close">
                    <i className="imgsvg ico_close">
                      컨텍스트 자동완성 레이어 닫기
                    </i>
                  </button>
                </div>
                <div className="dsc_plus">
                  <a
                    href="https://help.naver.com/alias/search/word/word_16.naver"
                    className="dsc_area"
                  >
                    <span className="dsc">
                      관심사를 반영한 컨텍스트 자동완성
                    </span>
                    <span className="ico_help">
                      <i className="imgsvg">도움말</i>
                    </span>
                  </a>
                </div>
              </div>
              <div id="sb-ac-footer" className="sggt_footer">
                <div className="side_opt_area">
                  <span className="opt_option">
                    <a id="sb-ac-toggle" href="#">
                      자동완성 끄기
                    </a>
                  </span>
                  <span className="opt_help">
                    <a href="https://help.naver.com/alias/search/word/word_17.naver">
                      도움말
                    </a>
                  </span>
                  <span className="opt_help">
                    <a
                      href="https://help.naver.com/alias/search/word/word_18.naver"
                      className="report"
                    >
                      신고
                    </a>
                  </span>
                </div>
                <span className="rside_opt_area">
                  <span className="opt_close">
                    <a id="sb-ac-close" href="#">
                      닫기
                    </a>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sch_tab_wrap _sch_tab_wrap">
        <div
          className="nav_intent _sch_tab type_t2 has_shadow"
          id="_sch_tab"
          style={{ transform: "translateY(0px)" }}
        >
          <div
            className="api_flicking_wrap"
            role="tablist"
            data-log-innerscroll="a=tab.tfk"
          >
            <div className="flick_bx" role="presentation">
              <a
                role="tab"
                href="?ssc=tab.m_blog.all&amp;sm=mtb_jum&amp;query=%EC%82%AC%EB%8B%A4%EB%A6%AC%ED%83%80%EA%B8%B0%EA%B2%8C%EC%9E%84"
                className="tab"
                aria-selected="false"
              >
                <i className="spnew2 ico_nav_blog"></i>블로그
              </a>
            </div>
            <div className="flick_bx" role="presentation">
              <a
                role="tab"
                href="?ssc=tab.m_cafe.all&amp;sm=mtb_jum&amp;query=%EC%82%AC%EB%8B%A4%EB%A6%AC%ED%83%80%EA%B8%B0%EA%B2%8C%EC%9E%84"
                className="tab"
                aria-selected="false"
              >
                <i className="spnew2 ico_nav_cafe"></i>카페
              </a>
            </div>
            <div className="flick_bx" role="presentation">
              <a
                role="tab"
                href="?ssc=tab.m_image.all&amp;where=m_image&amp;sm=mtb_jum&amp;query=%EC%82%AC%EB%8B%A4%EB%A6%AC%ED%83%80%EA%B8%B0%EA%B2%8C%EC%9E%84"
                className="tab"
                aria-selected="false"
              >
                <i className="spnew2 ico_nav_image"></i>이미지
              </a>
            </div>
            <div className="flick_bx" role="presentation">
              <a
                role="tab"
                href="?ssc=tab.m_kin.all&amp;where=m_kin&amp;sm=mtb_jum&amp;query=%EC%82%AC%EB%8B%A4%EB%A6%AC%ED%83%80%EA%B8%B0%EA%B2%8C%EC%9E%84"
                className="tab"
                aria-selected="false"
              >
                <i className="spnew2 ico_nav_kin"></i>지식iN
              </a>
            </div>
            <div className="flick_bx" role="presentation">
              <a
                role="tab"
                href="?ssc=tab.m_influencer.chl&amp;where=m_influencer&amp;sm=mtb_jum&amp;query=%EC%82%AC%EB%8B%A4%EB%A6%AC%ED%83%80%EA%B8%B0%EA%B2%8C%EC%9E%84"
                className="tab"
                aria-selected="false"
              >
                <i className="spnew2 ico_nav_inf"></i>인플루언서
              </a>
            </div>
            <div className="flick_bx" role="presentation">
              <a
                role="tab"
                href="?ssc=tab.m_clip.all&amp;sm=mtb_jum&amp;query=%EC%82%AC%EB%8B%A4%EB%A6%AC%ED%83%80%EA%B8%B0%EA%B2%8C%EC%9E%84"
                className="tab"
                aria-selected="false"
              >
                <i className="spnew2 ico_nav_clip"></i>클립
              </a>
            </div>
            <div className="flick_bx" role="presentation">
              <a
                role="tab"
                href="?ssc=tab.m_video.all&amp;where=m_video&amp;sm=mtb_jum&amp;query=%EC%82%AC%EB%8B%A4%EB%A6%AC%ED%83%80%EA%B8%B0%EA%B2%8C%EC%9E%84"
                className="tab"
                aria-selected="false"
              >
                <i className="spnew2 ico_nav_video"></i>동영상
              </a>
            </div>
            <div className="flick_bx" role="presentation">
              <a
                role="tab"
                href="https://msearch.shopping.naver.com/search/all?query=%EC%82%AC%EB%8B%A4%EB%A6%AC%ED%83%80%EA%B8%B0%EA%B2%8C%EC%9E%84"
                className="tab"
                aria-selected="false"
              >
                쇼핑
              </a>
            </div>
            <div className="flick_bx" role="presentation">
              <a
                role="tab"
                href="?ssc=tab.m_news.all&amp;where=m_news&amp;sm=mtb_jum&amp;query=%EC%82%AC%EB%8B%A4%EB%A6%AC%ED%83%80%EA%B8%B0%EA%B2%8C%EC%9E%84"
                className="tab"
                aria-selected="false"
              >
                <i className="spnew2 ico_nav_news"></i>뉴스
              </a>
            </div>
            <div className="flick_bx" role="presentation">
              <a
                role="tab"
                href="https://dict.naver.com/dict.search?query=%EC%82%AC%EB%8B%A4%EB%A6%AC%ED%83%80%EA%B8%B0%EA%B2%8C%EC%9E%84&amp;from=tsearch"
                className="tab"
                aria-selected="false"
              >
                어학사전
              </a>
            </div>
            <div className="flick_bx" role="presentation">
              <a
                role="tab"
                href="https://m.map.naver.com/search.nhn?query=%EC%82%AC%EB%8B%A4%EB%A6%AC%ED%83%80%EA%B8%B0%EA%B2%8C%EC%9E%84"
                className="tab"
                aria-selected="false"
              >
                지도
              </a>
            </div>
            <div className="flick_bx" role="presentation">
              <a
                role="tab"
                href="https://msearch.shopping.naver.com/book/search?query=%EC%82%AC%EB%8B%A4%EB%A6%AC%ED%83%80%EA%B8%B0%EA%B2%8C%EC%9E%84"
                className="tab"
                aria-selected="false"
              >
                도서
              </a>
            </div>
            <div className="flick_bx" role="presentation">
              <a
                role="tab"
                href="https://terms.naver.com/search.naver?query=%EC%82%AC%EB%8B%A4%EB%A6%AC%ED%83%80%EA%B8%B0%EA%B2%8C%EC%9E%84"
                className="tab"
                aria-selected="false"
              >
                지식백과
              </a>
            </div>
            <div className="flick_bx" role="presentation">
              <a
                role="tab"
                href="#"
                className="tab option _option_on_off"
                aria-pressed="false"
              >
                검색옵션
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
