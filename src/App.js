import { useEffect, useState } from "react";
import { TVShowAPI } from "./API/tv-show";
import "./global.css";
import s from "./style.module.css";
import { BACKDROP_BASE_URL } from "./config";
import { TVShowDetail } from "./components/TVShowDetail/TVShowDetail";
import { Logo } from "./components/Logo/Logo";
import logo from "./assets/images/logo.png";
import { TvShowList } from "./components/TvShowList/TvShowList";
import { SearchBar } from "./components/SearchBar/SearchBar";
export function App() {
  const [currentTVShow, setCurrentTVShow] = useState();
  const [recommendations, setRecommendations] = useState([]);
  async function fetchPopulars() {
    const populars = await TVShowAPI.fetchPopulars();
    if (populars.length > 0) {
      setCurrentTVShow(populars[1]);
    }
  }
  async function fetchRecommendations(tvShowIds) {
    const recommendations = await TVShowAPI.fetchRecommendations(tvShowIds);
    if (recommendations.length > 0) {
      setRecommendations(recommendations.slice(0, 10));
    }
  }
  useEffect(() => {
    fetchPopulars();
  }, []);

  useEffect(() => {
    if (currentTVShow) {
      fetchRecommendations(currentTVShow.id);
    }
  }, [currentTVShow]);

  async function searchTVShow(tvShowName) {
    const searchResponse = await TVShowAPI.fetchByTitle(tvShowName);
    if (searchResponse.length > 0) {
      setCurrentTVShow(searchResponse[0]);
    }
  }
  return (
    <div
      className={s.main_container}
      style={{
        background: currentTVShow
          ? `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url("${BACKDROP_BASE_URL}${currentTVShow.backdrop_path}") no-repeat center / cover`
          : "black",
      }}
    >
      <div className={s.header}>
        <div className="row">
          <div className="col-4">
            <Logo
              image={logo}
              title="whattowatch"
              subtitle="Find a Show you might like"
            />
          </div>
          <div className="col-md-12 col-lg-4">
            <SearchBar onSubmit={searchTVShow} />
          </div>
        </div>
      </div>
      <div className={s.tv_show_details}>
        {currentTVShow && <TVShowDetail tvShow={currentTVShow} />}
      </div>
      <div className={s.recommended_shows}>
        {currentTVShow && (
          <TvShowList
            onClickItem={setCurrentTVShow}
            tvShowList={recommendations}
          />
        )}
      </div>
    </div>
  );
}
