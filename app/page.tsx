import { GhostLeg } from "@/components/ghostLeg";
import { RelatedSearch } from "@/components/relatedSearch";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <div
        id="container"
        className="_slog_visible_page"
        data-slog-p="i1%2BNfwqVWUZssdDckhCssssstmK-516903"
        data-slog-sscode="tab.m.all"
        data-slog-pg="i1%2BNfwqVWUZssdDckhCssssstmK-516903"
        data-slog-pn="1"
        data-slog-url="https://s.search.naver.com/n/scrolllog/v2?u=https%3A%2F%2Fm.search.naver.com%2Fsearch.naver%3Fwhere%3Dm%26sm%3Dtop_sug.pre%26fbm%3D0%26acr%3D1%26acq%3D%25EC%2582%25AC%25EB%258B%25A4%26qdt%3D0%26ie%3Dutf8%26query%3D%25EC%2582%25AC%25EB%258B%25A4%25EB%25A6%25AC%25ED%2583%2580%25EA%25B8%25B0%25EA%25B2%258C%25EC%259E%2584%26ssc%3Dtab.m.all&amp;q=%EC%82%AC%EB%8B%A4%EB%A6%AC%ED%83%80%EA%B8%B0%EA%B2%8C%EC%9E%84&amp;sscode=tab.m.all&amp;pg=i1%2BNfwqVWUZssdDckhCssssstmK-516903"
        data-slog-visible="true"
      >
        <div id="ct">
          {/* 연관 검색 */}
          <RelatedSearch />
          {/* 사다리 게임 */}
          <GhostLeg />
        </div>
      </div>
      <Footer />
    </>
  );
}
